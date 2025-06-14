import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import EditUserForm from "../../forms/users/edit-user-form";
import { User } from "@/utils/types/User";


interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="px-16  md:min-w-[800px]">
        <DialogHeader className="hidden">
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div>
        <EditUserForm user={user}/> 
          </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog;
