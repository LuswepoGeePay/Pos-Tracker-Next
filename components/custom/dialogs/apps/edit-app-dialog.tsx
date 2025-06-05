import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { App } from "@/utils/types/Apps";


interface EditAppDialogProps {
  App: App | null;
  open: boolean;
  onClose: () => void;
}

const EditAppDialog: React.FC<EditAppDialogProps> = ({ App, open, onClose }) => {
  if (!App) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="px-16  md:w-[800px]">
        <DialogHeader>
          <DialogTitle>App Details</DialogTitle>
        </DialogHeader>
        <div>
       {/* <EditAppForm App={App}/> */}
          </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditAppDialog;
