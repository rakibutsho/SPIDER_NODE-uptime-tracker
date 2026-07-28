// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Pencil, HelpCircle } from "lucide-react"; // Added Question mark icon
// import { useHideContestMutation } from "@/redux/features/dashboard/dashboard.api";

// interface DeleteModalProps {
//   id: string;
//   type: "content" | "style";
//   btn: "icon" | "btn";
//   message: "Hide" | "Unblocking" | "Deleting" | "Approve";
// }

// const DeleteModal = ({ id, type, btn, message }: DeleteModalProps) => {
//   const [open, setOpen] = useState(false);
//   const [hideContent] = useHideContestMutation();

//   const handleDelete = async () => {
//     const toastId = toast.loading(`${message}...`);
//     try {
//       let res;
//       if (type === "content") {
//         res = await hideContent(id).unwrap();
//       } else if (type === "style") {
//         res = await hideContent(id).unwrap();
//       }

//       if (res?.data) {
//         toast.success(`${message} Successfully`, { id: toastId });
//         setOpen(false);
//       } else {
//         toast.error(res?.error?.data?.message || `Failed to ${message}`, {
//           id: toastId,
//         });
//         setOpen(false);
//       }
//     } catch (err: any) {
//       toast.error(err?.data?.message || `Failed to ${message}`, {
//         id: toastId,
//       });
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       {btn === "icon" ? (
//         <DialogTrigger className="text-primary">
//           <Pencil />
//         </DialogTrigger>
//       ) : (
//         <DialogTrigger className="bg-[#A141FE]/20 hover:bg-[#A141FE]/30 text-[#A141FE] px-3 py-1 rounded-md">
//           {message}
//         </DialogTrigger>
//       )}

//       <DialogContent className="max-w-[450px] !rounded-3xl bg-[#0f172a] border border-[#A141FE]/40 text-white [&>button]:hidden">
//         <DialogHeader>
//           <DialogTitle>
//             <div className="flex flex-col items-center gap-6 text-center">
//               {/* Icon */}
//               <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#A141FE]/20">
//                 <HelpCircle className="w-8 h-8 text-[#A141FE]" />
//               </div>

//               {/* Title */}
//               <h3 className="text-xl font-semibold">
//                 Are you sure you want to proceed with{" "}
//                 <span className="text-[#A141FE]">{message}</span>?
//               </h3>

//               {/* Actions */}
//               <div className="flex md:gap-5 gap-3">
//                 <button
//                   onClick={() => setOpen(false)}
//                   className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="bg-[#A141FE] hover:bg-[#8b2de8] text-white py-2 px-6 rounded-lg transition-colors"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </DialogTitle>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DeleteModal;
