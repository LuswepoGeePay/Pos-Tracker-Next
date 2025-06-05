import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { base_url } from "@/utils/api_constants";
import { App } from "@/utils/types/Apps";


interface ViewAppDialogProps {
  app: App | null;
  open: boolean;
  onClose: () => void;
}

const ViewAppDialog: React.FC<ViewAppDialogProps> = ({ app, open, onClose }) => {
  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:w-[800px]">
        <DialogHeader>
          <DialogTitle>App Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div>
            <p className="font-semibold text-lg">Name</p>
           
          </div>
          <div>
          
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

export default ViewAppDialog;
