import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Business } from "@/utils/types/Business";

interface ViewBusinessDialogProps {
  business: Business | null;
  open: boolean;
  onClose: () => void;
}

const ViewBusinessDialog: React.FC<ViewBusinessDialogProps> = ({ business, open, onClose }) => {
  if (!business) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:w-[800px] lg:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Business Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-semibold text-lg">Name</p>
            <p>{business.name}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Email</p>
            <p>{business.email}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Phone number</p>
            <p>{business.phone}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Address</p>
            <p>{business.address}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Logo</p>
            <p>{business.business_logo}</p>
          </div>

          
        </div>
        <DialogFooter>
          <Button
            className="w-[300px]"
            variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewBusinessDialog;
