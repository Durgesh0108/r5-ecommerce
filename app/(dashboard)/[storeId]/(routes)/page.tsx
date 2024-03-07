import prismadb from "@/lib/prismadb";

interface DashboardProps {
	params: { storeId: string };
}

const Dashboard: React.FC<DashboardProps> = async ({ params }) => {
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
		},
	});

	return (
		<div>
			<p>Active Store: {store?.name}</p>
		</div>
	);
};

export default Dashboard;
