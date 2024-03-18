import SuccessModal from "@/components/success-modal";

const success = () => {
  return (
    <div>
      <SuccessModal
        props={{
          modalTitle: "Network Added",
          modalDescription: "You have successfully added the network",
          modalButtonText: "Close",
          modalButtonOnClick: () => console.log("Close"),
        }}
      />
    </div>
  );
};

export default success;
