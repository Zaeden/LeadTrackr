import { Request, Response } from "express";
import prisma from "../db/db.config";
import { LeadStatus } from "@prisma/client";

class DashboardController {
  static async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      // Get lead status counts
      const leadStatusCountsRaw = await prisma.lead.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      const leadStatusCounts = Object.values(LeadStatus).map((status) => ({
        status,
        count:
          leadStatusCountsRaw.find((entry) => entry.status === status)?._count
            .status || 0,
      }));

      console.log("Total Leads: ", leadStatusCounts);

      // Get leads created per month
      const leadsByMonth = await prisma.$queryRaw<
        { year: number; month: number; count: BigInt }[]
      >`
        SELECT 
        EXTRACT(YEAR FROM "createdAt") AS year,
        EXTRACT(MONTH FROM "createdAt") AS month,
        COUNT(*) AS count
        FROM "Lead"
        GROUP BY year, month
        ORDER BY year, month;
      `;

      // Get converted leads by user
      const userConversions = await prisma.lead.groupBy({
        by: ["assignedTo"], // Use "assignedTo" instead of "assignedToId"
        _count: { _all: true },
        where: { status: LeadStatus.COMPLETED },
      });

      // 🔥 Convert BigInt to number/string before sending response
      const formattedLeadsByMonth = leadsByMonth.map((entry) => ({
        ...entry,
        count: Number(entry.count), // Convert BigInt to number
      }));

      const formattedUserConversions = userConversions.map((entry) => ({
        assignedTo: entry.assignedTo.toString(), // Convert BigInt to string
        count: entry._count._all, // Convert count to number if needed
      }));

      res.status(200).json({
        success: true,
        leadStatusCounts,
        leadsByMonth: formattedLeadsByMonth,
        userConversions: formattedUserConversions,
      });
    } catch (error) {
      console.error("Dashboard API Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}

export default DashboardController;
