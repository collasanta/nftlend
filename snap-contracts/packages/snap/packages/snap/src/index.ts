import type { OnTransactionHandler } from '@metamask/snaps-types';

import { getInsights } from './insights';

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {
  const insights = await getInsights(transaction, transactionOrigin || '');
  return insights;
};
