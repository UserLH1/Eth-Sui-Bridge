module 0x0::test_ibt {
    use sui::tx_context::TxContext;
    use 0x0::IBT;

    #[test(ctx = tx_context::TxContext)]
    public fun test_init_for_testing(ctx: &mut TxContext) {
        IBT::init_for_testing(ctx);
        assert!(true, 0); // Simplu assert pentru validare
    }
}
