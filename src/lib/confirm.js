import Swal from "sweetalert2";

const base = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    popup: "rounded-2xl border border-line font-sans",
    title: "font-display text-ink",
    confirmButton:
      "inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium mx-1.5",
    cancelButton:
      "inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium mx-1.5 bg-paper-dim text-ink-soft",
  },
});

export async function confirmAction({
  title = "Are you sure?",
  text,
  confirmText = "Confirm",
  danger = false,
}) {
  const result = await base.fire({
    title,
    text,
    icon: danger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: `inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium mx-1.5 text-white ${
        danger ? "bg-[#C4453A]" : "bg-[#14181F]"
      }`,
    },
  });
  return result.isConfirmed;
}