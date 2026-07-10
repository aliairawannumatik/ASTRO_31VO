import { useParams, Navigate } from "react-router-dom";
import RPPDetailPage from "@/components/RPPDetailPage";
import { rppCatalog } from "@/data/rpp";
import { buildRPPDetailData } from "@/data/rppHelpers";

const RPPDetailDynamicPage = () => {
  const { materiSlug, subSlug } = useParams<{ materiSlug: string; subSlug: string }>();
  const materi = materiSlug ? rppCatalog[materiSlug] : undefined;
  const sub = materi?.subMateri.find((s) => s.slug === subSlug);

  if (!materi || !sub) return <Navigate to="/ruang-untuk-guru/rpp" replace />;

  const data = buildRPPDetailData(materi, sub);
  return <RPPDetailPage data={data} />;
};

export default RPPDetailDynamicPage;
