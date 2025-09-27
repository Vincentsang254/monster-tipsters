import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import moment from "moment";
import Loader from "@/components/common/Loader";
import { deleteTip, fetchTips, updateTip } from "@/features/slices/tipsSlice";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AdminTips = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.tips.status);
  const error = useSelector((state) => state.tips.error);
  const tips = useSelector((state) => state.tips.list) || [];

  const [selectedTip, setSelectedTip] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    league: "",
    odds: "",
    results: "",
    tipsType: "",
    prediction: "",
    match: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    dispatch(fetchTips());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTip) {
      setFormData({
        league: selectedTip.league,
        odds: selectedTip.odds,
        results: selectedTip.results,
        tipsType: selectedTip.tipsType,
        prediction: selectedTip.prediction,
        match: selectedTip.match,
        date: moment(selectedTip.date).format("YYYY-MM-DD"),
        time: moment(selectedTip.time, "HH:mm").format("HH:mm"),
      });
    } else {
      setFormData({
        league: "",
        odds: "",
        results: "",
        tipsType: "",
        prediction: "",
        match: "",
        date: "",
        time: "",
      });
    }
  }, [selectedTip]);

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteTip(confirmDelete.id)).unwrap();
        setConfirmDelete(null);
        dispatch(fetchTips());
        toast.success("Tip deleted successfully");
      } catch (error) {
        toast.error("Error deleting tip: " + error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (
      !formData.league ||
      !formData.prediction ||
      !formData.odds ||
      !formData.tipsType ||
      !formData.match
    ) {
      toast.error("Please fill all required fields", {
        position: "top-center",
      });
      return;
    }

    try {
      if (selectedTip) {
        await dispatch(updateTip({ tipId: selectedTip.id, formData })).unwrap();
        setSelectedTip(null);
        dispatch(fetchTips());
        toast.success("Tip updated successfully");
      }
    } catch (error) {
      toast.error("Error updating tip: " + error.message);
    }
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.match.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tip.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.prediction.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || tip.tipsType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getResultBadge = (result) => {
    switch (result) {
      case "win": return <Badge variant="success">Win</Badge>;
      case "loss": return <Badge variant="destructive">Loss</Badge>;
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      default: return <Badge variant="outline">N/A</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "vip": return <Badge variant="premium">VIP</Badge>;
      default: return <Badge>Standard</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tips Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and update betting tips</p>
        </div>
        <Link to="/admin/post" className="w-full md:w-auto">
          <Button className="gap-2 w-full md:w-auto">
            <FaPlus className="h-4 w-4" />
            Add New Tip
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tips by match, league or prediction..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <FaFilter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tips</SelectItem>
                  <SelectItem value="client">Standard Tips</SelectItem>
                  <SelectItem value="vip">VIP Tips</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {status === "pending" && <Loader className="my-8" />}
      {status === "rejected" && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Tips</CardDescription>
                <CardTitle className="text-3xl">{tips.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>VIP Tips</CardDescription>
                <CardTitle className="text-3xl">
                  {tips.filter(t => t.tipsType === "vip").length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Winning Tips</CardDescription>
                <CardTitle className="text-3xl">
                  {tips.filter(t => t.results === "win").length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Tips</CardDescription>
                <CardTitle className="text-3xl">
                  {tips.filter(t => t.results === "pending").length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Tips</CardTitle>
                  <CardDescription>
                    {filteredTips.length} tips found
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {moment().format("MMM D, h:mm A")}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[150px]">League</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Prediction</TableHead>
                      <TableHead>Odds</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTips.length > 0 ? (
                      filteredTips.map((tip) => (
                        <TableRow key={tip.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{tip.league}</TableCell>
                          <TableCell>{tip.match}</TableCell>
                          <TableCell>{tip.prediction}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{tip.odds}</Badge>
                          </TableCell>
                          <TableCell>{getTypeBadge(tip.tipsType)}</TableCell>
                          <TableCell>{getResultBadge(tip.results)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{moment(tip.date).format("MMM D, YYYY")}</span>
                              <span className="text-sm text-gray-500">
                                {moment(tip.time, "HH:mm").format("h:mm A")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTip(tip)}
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDelete(tip)}
                            >
                              <FaTrashAlt className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No tips found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredTips.length > 0 ? (
              filteredTips.map((tip) => (
                <Card key={tip.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{tip.league}</CardTitle>
                        <CardDescription>{tip.match}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getTypeBadge(tip.tipsType)}
                        {getResultBadge(tip.results)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Prediction</p>
                          <p className="font-medium">{tip.prediction}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Odds</p>
                          <p className="font-medium">{tip.odds}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p>{moment(tip.date).format("MMM D, YYYY")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p>{moment(tip.time, "HH:mm").format("h:mm A")}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTip(tip)}
                        >
                          <FaEdit className="h-4 w-4" />
                          <span className="ml-2">Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setConfirmDelete(tip)}
                        >
                          <FaTrashAlt className="h-4 w-4" />
                          <span className="ml-2">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No tips found matching your criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Edit Tip Dialog */}
      <Dialog open={!!selectedTip} onOpenChange={(open) => !open && setSelectedTip(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTip ? "Edit Tip" : "Create Tip"}</DialogTitle>
            <DialogDescription>
              {selectedTip ? "Update the tip details below" : "Fill in the details for the new tip"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="league">League *</Label>
                <Input
                  id="league"
                  name="league"
                  value={formData.league}
                  onChange={handleChange}
                  placeholder="Premier League"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="match">Match *</Label>
                <Input
                  id="match"
                  name="match"
                  value={formData.match}
                  onChange={handleChange}
                  placeholder="Team A vs Team B"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prediction">Prediction *</Label>
                <Input
                  id="prediction"
                  name="prediction"
                  value={formData.prediction}
                  onChange={handleChange}
                  placeholder="Home Win"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odds">Odds *</Label>
                <Input
                  id="odds"
                  name="odds"
                  value={formData.odds}
                  onChange={handleChange}
                  placeholder="2.50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipsType">Tip Type *</Label>
                <Select
                  value={formData.tipsType}
                  onValueChange={(value) => handleSelectChange("tipsType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Standard</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="results">Result</Label>
                <Select
                  value={formData.results}
                  onValueChange={(value) => handleSelectChange("results", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTip(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the tip.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {confirmDelete && (
              <>
                <p className="font-medium">{confirmDelete.league} - {confirmDelete.match}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {confirmDelete.prediction} @ {confirmDelete.odds}
                </p>
                <div className="flex gap-2 mt-2">
                  {getTypeBadge(confirmDelete.tipsType)}
                  {getResultBadge(confirmDelete.results)}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Tip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTips;