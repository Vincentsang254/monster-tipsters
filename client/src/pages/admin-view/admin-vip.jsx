/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import moment from "moment";
import Loader from "@/components/common/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  deleteCode,
  fetchCodes,
  updateCode,
  createCode
} from "@/features/slices/codeSlice";

const AdminVip = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.codes.status);
  const error = useSelector((state) => state.codes.error);
  const tips = useSelector((state) => state.codes.list);

  // Local UI state
  const [selectedTip, setSelectedTip] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    results: "",
    codeType: "",
    code: "",
  });

  // Fetch codes on mount
  useEffect(() => {
    dispatch(fetchCodes());
  }, [dispatch]);

  // Populate form when selecting a tip to edit
  useEffect(() => {
    if (selectedTip) {
      setFormData({
        code: selectedTip.code || "",
        codeType: selectedTip.codeType || "",
        results: selectedTip.results || "pending",
      });
    } else {
      setFormData({ code: "", results: "pending", codeType: "" });
    }
  }, [selectedTip]);

  // Derived filtered list
  const filteredTips = useMemo(() => {
    if (!Array.isArray(tips)) return [];
    return tips
      .filter((t) => {
        if (filterType === "all") return true;
        return t.codeType === filterType;
      })
      .filter((t) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          (t.code || "").toLowerCase().includes(q) ||
          (t.codeType || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  }, [tips, searchTerm, filterType]);

  // Handlers
  const openEdit = (tip) => {
    setSelectedTip(tip);
    setShowEditDialog(true);
  };

  const closeEdit = () => {
    setSelectedTip(null);
    setShowEditDialog(false);
  };

  const handleDeleteClick = (tip) => {
    setConfirmDelete(tip);
    setShowDeleteDialog(true);
  };

  const closeDelete = () => {
    setConfirmDelete(null);
    setShowDeleteDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

const handleSave = async () => {
  if (!formData.code || !formData.codeType || !formData.results) {
    toast.error("Please fill all required fields", { position: "top-center" });
    return;
  }

  try {
    if (selectedTip) {
      // Editing existing
      await dispatch(
        updateCode({ codeId: selectedTip.id, formData })
      ).unwrap();
    } else {
      // Creating new
      await dispatch(createCode(formData)).unwrap();
    }

    closeEdit();
    dispatch(fetchCodes());
  } catch (err) {
    toast.error("Error saving code: " + (err?.message || err));
  }
};


  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await dispatch(deleteCode(confirmDelete.id)).unwrap();
      closeDelete();
      dispatch(fetchCodes());
    } catch (err) {
      toast.error("Error deleting code: " + (err?.message || err));}
  };

  const getResultBadge = (result) => {
    switch (result) {
      case "win":
        return <Badge variant="success">Win</Badge>;
      case "loss":
        return <Badge variant="destructive">Loss</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Manage Premium Codes</h2>
          <p className="text-sm text-gray-500">
            Create, update, and delete betting codes (1xbet, SecretBet, Afropari).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm">
            <FaSearch className="text-gray-400" />
            <Input
              placeholder="Search by code or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={(v) => setFilterType(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue>{filterType === "all" ? "All types" : filterType}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="1xbet">1xbet</SelectItem>
                <SelectItem value="secretbet">secretbet</SelectItem>
                <SelectItem value="afropari">afropari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              // Open new blank form for creating a code (optional - currently we only support edit/delete) plus add new code by dispaching action createCode
              setSelectedTip(null);
              setFormData({ code: "", codeType: "", results: "pending" });
              setShowEditDialog(true);
            }}
          >
            <FaPlus className="mr-2" />
            New Code
          </Button>
        </div>
      </div>

      <Separator />

      {/* Table / Loading / Error */}
      <Card>
        <CardHeader>
          <CardTitle>Codes</CardTitle>
          <CardDescription>List of all codes</CardDescription>
        </CardHeader>

        <CardContent>
          {status === "pending" ? (
            <div className="py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Result</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No codes found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTips.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="font-medium">{t.code}</div>
                          <div className="text-xs text-gray-500">{t.code}</div>
                        </TableCell>
                        <TableCell>
                          <div className="capitalize">{t.codeType}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getResultBadge(t.results)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm font-medium">
                            {moment(t.createdAt).format("MMM DD, YYYY")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {moment(t.createdAt).format("hh:mm A")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEdit(t)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(t)}
                            >
                              <FaTrashAlt />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit / Create Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTip ? "Edit Code" : "New Code"}</DialogTitle>
            <DialogDescription>
              {selectedTip ? "Update the code details below." : "Create a new code."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Code</Label>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. 1X2-ABCD1234"
              />
            </div>

            <div>
              <Label>Code Type</Label>
              <Select
                value={formData.codeType}
                onValueChange={(v) => handleSelectChange("codeType", v)}
              >
                <SelectTrigger>
                  <SelectValue>{formData.codeType || "Select type"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1xbet">1xbet</SelectItem>
                  <SelectItem value="secretbet">secretbet</SelectItem>
                  <SelectItem value="afropari">afropari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Results</Label>
              <Select
                value={formData.results}
                onValueChange={(v) => handleSelectChange("results", v)}
              >
                <SelectTrigger>
                  <SelectValue>{formData.results || "Select result"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="win">win</SelectItem>
                  <SelectItem value="loss">loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" onClick={closeEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{selectedTip ? "Save" : "Create"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="text-sm text-gray-700 mb-4">
              <strong>Code:</strong> {confirmDelete?.code}
              <br />
              <strong>Type:</strong> {confirmDelete?.codeType}
            </div>

            <DialogFooter>
              <div className="flex items-center justify-end gap-2 w-full">
                <Button variant="ghost" onClick={closeDelete}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVip;
