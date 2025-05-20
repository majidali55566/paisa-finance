import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TransactionConfirmationDialogProps {
  open: boolean;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  onClose: () => void;
}

export function TransactionConfirmationDialog({
  open,
  isSubmitting,
  handleSubmit,
  onClose,
}: TransactionConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete confirmation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex">
            <h3>Are you sure you want to delete this transaction?</h3>
          </div>
        </div>
        <DialogFooter>
          {isSubmitting ? (
            <Button disabled size="lg" className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              type="submit"
              size="lg"
              className="w-full"
            >
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
