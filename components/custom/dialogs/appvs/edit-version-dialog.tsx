import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AppVersion } from "@/utils/types/Apps";


interface EditAppVersionDialogProps {
  AppVersion: AppVersion | null;
  open: boolean;
  onClose: () => void;
}

const EditAppVersionDialog: React.FC<EditAppVersionDialogProps> = ({ AppVersion, open, onClose }) => {
  if (!AppVersion) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="px-16  md:w-[800px]">
        <DialogHeader>
          <DialogTitle>AppVersion Details</DialogTitle>
        </DialogHeader>
        <div>
       {/* <EditAppVersionForm AppVersion={AppVersion}/> */}
          </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditAppVersionDialog;
