import type { OnTransactionHandler } from '@metamask/snaps-types';

import { getInsights } from './insights';

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {
  const origin = transactionOrigin ?? 'Unknown Origin';
  const insights = await getInsights(transaction, origin);
  return insights;
};
