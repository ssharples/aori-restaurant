import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cart';

describe('Cart Store - Group Orders', () => {
  beforeEach(() => {
    const { clearCart, disableGroupMode } = useCartStore.getState();
    clearCart();
    disableGroupMode();
    // reset participants
    useCartStore.setState({ participants: [], activeParticipantId: undefined });
  });

  it('enables group mode and adds participants', () => {
    const { enableGroupMode, addParticipant } = useCartStore.getState();
    enableGroupMode();
    const p = addParticipant('Alice');
    expect(useCartStore.getState().groupMode).toBe(true);
    expect(useCartStore.getState().participants.length).toBe(1);
    expect(useCartStore.getState().participants[0].name).toBe('Alice');
    expect(p.id).toBeDefined();
  });

  it('assigns items to active participant and computes split', () => {
    const store = useCartStore.getState();
    store.enableGroupMode();
    const alice = store.addParticipant('Alice');
    store.setActiveParticipant(alice.id);

    // minimal menu item for test
    const menuItem = { id: 'test', name: 'Test', price: 5, category: 'sides' as const };
    store.addItem(menuItem, undefined, 2, alice.id);

    const summary = store.getSplitSummary();
    expect(summary.length).toBe(1);
    expect(summary[0].participantName).toBe('Alice');
    expect(summary[0].subtotal).toBe(10);
    expect(store.getTotal()).toBe(10);
  });
});


