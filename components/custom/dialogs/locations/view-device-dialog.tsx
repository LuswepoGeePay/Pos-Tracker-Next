import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LHistory } from "@/utils/types/PosDevices";

interface ViewLHistoryDialogProps {
  history: LHistory | null;
  open: boolean;
  onClose: () => void;
}

const ViewLHistoryDialog: React.FC<ViewLHistoryDialogProps> = ({ history, open, onClose }) => {
  if (!history) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:w-[800px] lg:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Location Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-semibold text-lg">Device Name</p>
            <p>{history.device_name}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Region</p>
            <p>{history.region}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Longitude</p>
            <p>{history.longitude}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Latitude</p>
            <p>{history.latitude}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Timestamp</p>
            <p>{history.timestamp}</p>
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

export default ViewLHistoryDialog;
