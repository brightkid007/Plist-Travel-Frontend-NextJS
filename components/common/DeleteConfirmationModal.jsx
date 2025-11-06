"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title, message, itemName, loading = false, confirmLabel = "Delete", confirmingLabel = "Deleting..." }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-dialog-title" className="d-flex items-center gap-10">
        <AlertTriangle className="text-red-1" size={24} />
        <span className="text-18 fw-600">{title || "Confirm Delete"}</span>
      </DialogTitle>
      <DialogContent>
        <div id="delete-dialog-description" className="text-14 text-light-1 lh-20">
          {message || `Are you sure you want to delete ${itemName ? `"${itemName}"` : "this item"}?`}
          <br />
          <span className="text-red-1 fw-500 mt-10 d-block">This action cannot be undone.</span>
        </div>
      </DialogContent>
      <DialogActions className="px-20 pb-20">
        <button
          className="text-14 border-light rounded-8 px-15 py-8 fw-500"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="text-14 bg-red-1 text-white rounded-8 px-15 py-8 fw-500"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? confirmingLabel : confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;

