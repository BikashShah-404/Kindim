// ActionsCell.jsx
import {
  useDeliverOrderMutation,
  usePayOrderMutation,
} from "@/redux/api/orderSlice";
import { toast } from "react-toastify";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const ActionsCell = ({ order }) => {
  const [markAsDelivered] = useDeliverOrderMutation();
  const [markAsPaid] = usePayOrderMutation();

  const handleMarkAsDelivered = async () => {
    try {
      const response = await markAsDelivered(order._id).unwrap();
      if (response.status === 200) {
        toast.success("Order marked as delivered");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      const response = await markAsPaid(order._id).unwrap();
      if (response.status === 200) {
        toast.success("Order marked as paid");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order._id)}
        >
          Copy Order ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMarkAsPaid} disabled={order.isPaid}>
          Mark As Paid
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleMarkAsDelivered}
          disabled={order.isDelivered}
        >
          Mark As Delivered
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ActionsCell;
