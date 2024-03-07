"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
	const onOpen = useStoreModal((state) => state.onOpen);
	const isOpen = useStoreModal((state) => state.isOpen);

	useEffect(() => {
		if (!isOpen) {
			onOpen();
		}
  }, [isOpen, onOpen]);
  
	return null;
	// (
	// 	<div className="p-4">
	// 		{/* <Modal
	// 			isOpen
	// 			onClose={() => {}}
	// 			title="test"
	// 			description="test desc"
	// 		>
	// 			Children
	//     </Modal> */}
	//     Root Page
	// 	</div>
	// );
};

export default SetupPage;
