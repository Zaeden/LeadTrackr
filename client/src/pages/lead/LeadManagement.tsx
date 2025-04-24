import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import * as apiClient from "../../api-client";
import LeadList from "./LeadList";
import { LeadType } from "../../types/LeadType";
import AddLead from "../../components/forms/AddLead";
import EditLead from "../../components/forms/EditLead";
import DeleteLeadDailog from "../../components/ui/DeleteLeadDailog";
import {
  sourceOptions,
  leadStatus,
  priorityOptions,
} from "../../data/dropDownData";

const LeadManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [data, setData] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    source: "",
    priority: "",
  });

  const handleAddLead = () => {
    setIsModalOpen(true);
  };

  const fetchData = async (
    search = "",
    filtersOverride = filters,
    page = 1
  ) => {
    setLoading(true);
    try {
      const response = await apiClient.getAllLeads({
        search,
        page,
        limit: 10,
        ...filtersOverride,
      });

      if (response.success) {
        setData(response.leads);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchQuery, filters, currentPage);
  }, [currentPage, searchQuery, filters]);

  // ⭐ DOTTED PAGINATION UTILITY
  const getPagination = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600">Lead Management</h1>
        <button
          onClick={handleAddLead}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, email, or phone"
          className="px-4 py-2 border rounded-md w-1/3 focus:outline-none text-gray-500 font-semibold"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.status}
          onChange={(e) => {
            const newFilters = { ...filters, status: e.target.value };
            setFilters(newFilters);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          {leadStatus.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.source}
          onChange={(e) => {
            const newFilters = { ...filters, source: e.target.value };
            setFilters(newFilters);
            setCurrentPage(1);
          }}
        >
          <option value="">All Sources</option>
          {sourceOptions.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.priority}
          onChange={(e) => {
            const newFilters = { ...filters, priority: e.target.value };
            setFilters(newFilters);
            setCurrentPage(1);
          }}
        >
          <option value="">All Priority</option>
          {priorityOptions.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lead List */}
      {loading ? (
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No courses found matching your filters.
        </div>
      ) : (
        <LeadList
          data={data}
          openEdit={(leadId) => {
            setSelectedLeadId(leadId);
            setIsEditModalOpen(true);
          }}
          openDelete={(leadId) => {
            setSelectedLeadId(leadId);
            setIsDeleteModalOpen(true);
          }}
        />
      )}

      {/* 🌟 DOTTED PAGINATION UI */}
      <div className="mt-4 flex justify-center gap-2">
        {getPagination(currentPage, totalPages).map((page, index) => {
          if (page === "...") {
            return (
              <span key={index} className="px-3 py-1 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(Number(page))}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddLead
          onClose={() => setIsModalOpen(false)}
          onAddLead={() => {
            fetchData();
            setIsModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditLead
          leadId={selectedLeadId}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateLead={() => {
            fetchData();
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteLeadDailog
          leadId={selectedLeadId}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteLead={() => {
            fetchData();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default LeadManagement;
