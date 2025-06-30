import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import EditBusinessForm from "../../forms/business/edit-business-form";
import { Business } from "@/utils/types/Business";


interface EditBusinessDialogProps {
  business: Business | null;
  open: boolean;
  onClose: () => void;
}

const EditBusinessDialog: React.FC<EditBusinessDialogProps> = ({ business, open, onClose }) => {
  if (!business) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="px-16  md:min-w-[800px] w-full">
        <DialogHeader className="hidden">
          <DialogTitle>Business Information</DialogTitle>
        </DialogHeader>
        <div>
       <EditBusinessForm business={business}/> 
          </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditBusinessDialog;
