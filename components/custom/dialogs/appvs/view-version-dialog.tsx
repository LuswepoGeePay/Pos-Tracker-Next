import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AppVersion } from "@/utils/types/Apps";


interface ViewAppVersionDialogProps {
  app: AppVersion | null;
  open: boolean;
  onClose: () => void;
}

const ViewAppVersionDialog: React.FC<ViewAppVersionDialogProps> = ({ app, open, onClose }) => {
  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>App Version Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <p className="font-semibold text-lg">App Name</p>
            <p>{app.app_name}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Version Number</p>
            <p>{app.version_number}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Version Number</p>
            <p>{app.version_number}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Active</p>
            <p>{app.is_active ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Latest Release</p>
            <p>{app.is_latest_stable ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Date Released </p>
            <p>{app.released_at}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Release Notes</p>
            <p>{app.release_notes}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Release Notes</p>
            <p>{app.release_notes}</p>
          </div>
          <div>
          </div>
          <div>

            <div>
              <p className="font-semibold text-lg">Download URL</p>
              <p className="">{app.file_path}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Checksum</p>
              <p className=" ">{app.checksum}</p>
            </div>
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

export default ViewAppVersionDialog;
