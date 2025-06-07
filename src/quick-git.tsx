import { GitStatus } from "./components/GitStatus/GitStatus.js";
import { useRepo } from "./hooks/useRepo.js";

export default function Command() {
  const { value, isLoading } = useRepo();

  return <GitStatus repo={value} isLoadingRepo={isLoading} />;
}
