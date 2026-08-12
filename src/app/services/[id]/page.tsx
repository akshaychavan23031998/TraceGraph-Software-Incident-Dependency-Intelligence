import { ServiceDetail } from "@/components/services/service-detail";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceDetail serviceId={id} />;
}

