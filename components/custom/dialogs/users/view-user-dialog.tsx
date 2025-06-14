import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "@/utils/types/User";

interface ViewUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const ViewUserDialog: React.FC<ViewUserDialogProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <p className="font-semibold text-lg">Name</p>
            <p>{user.fullname}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Email</p>
            <p>{user.email}</p>
          </div>
           <div>
            <p className="font-semibold text-lg">Role</p>
          <p>{user.role}</p>
          </div>
           <div>
            <p className="font-semibold text-lg">Status</p>
          <p>{user.status}</p>
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

export default ViewUserDialog;
