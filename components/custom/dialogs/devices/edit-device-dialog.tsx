import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PosDevice } from "@/utils/types/PosDevices";
import EditDeviceForm from "../../forms/devices/edit-device-form";


interface EditDeviceDialogProps {
  pos: PosDevice | null;
  open: boolean;
  onClose: () => void;
}

const EditDeviceDialog: React.FC<EditDeviceDialogProps> = ({ pos, open, onClose }) => {
  if (!pos) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="px-16  md:min-w-[800px] w-full">
        <DialogHeader className="hidden">
          <DialogTitle>Device Details</DialogTitle>
        </DialogHeader>
        <div>
       <EditDeviceForm pos={pos}/> 
          </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditDeviceDialog;
