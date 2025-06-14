import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { base_url } from "@/utils/api_constants";
import { PosDevice } from "@/utils/types/PosDevices";

interface ViewDeviceDialogProps {
  pos: PosDevice | null;
  open: boolean;
  onClose: () => void;
}

const ViewDeviceDialog: React.FC<ViewDeviceDialogProps> = ({ pos, open, onClose }) => {
  if (!pos) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:w-[800px] lg:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Device Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-semibold text-lg">Name</p>
            <p>{pos.name}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Entity</p>
            <p>{pos.business_name}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Serial Number</p>
            <p>{pos.serial_number}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Current App Version</p>
            <p>{pos.current_app_version}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Operating System</p>
            <p>{pos.operating_system}</p>
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

export default ViewDeviceDialog;
