import { useRef } from 'react';
import { Lock } from 'lucide-react';
import { useUser } from '@stevederico/skateboard-ui/Context';
import { useSafeNavigate } from '@stevederico/skateboard-ui/Utilities';
import UpgradeSheet from '@stevederico/skateboard-ui/UpgradeSheet';
import type { UpgradeSheetHandle } from '@stevederico/skateboard-ui/UpgradeSheet';
import { Button } from '@stevederico/skateboard-ui/shadcn/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@stevederico/skateboard-ui/shadcn/ui/empty';

/**
 * Empty state shown when the backend answers 402 for a listing: the free
 * listing views are spent. Opens the Premium Host UpgradeSheet (Stripe
 * checkout for the first `stripeProducts` entry) or returns to the grid.
 *
 * @component
 * @returns Upgrade prompt with the upgrade drawer
 */
export default function UpgradeRequired() {
  const user = useUser();
  const navigate = useSafeNavigate();
  const upgradeRef = useRef<UpgradeSheetHandle>(null);

  /** Open the upgrade drawer. */
  const handleUpgrade = () => upgradeRef.current?.show();

  return (
    <section aria-label="Upgrade required" className="flex flex-1 items-center justify-center p-4">
      <Empty role="status">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Lock size={24} /></EmptyMedia>
          <EmptyTitle className="text-balance">You've used your free listing views</EmptyTitle>
          <EmptyDescription>Upgrade to Verified Host for unlimited listings.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button onClick={handleUpgrade}>Upgrade</Button>
          <Button variant="outline" onClick={() => navigate('/app/home')}>Back to Listings</Button>
        </EmptyContent>
      </Empty>
      <UpgradeSheet ref={upgradeRef} userEmail={user?.email} />
    </section>
  );
}
