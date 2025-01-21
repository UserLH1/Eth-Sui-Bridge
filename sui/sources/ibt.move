module {{sender}}::ibt {
    use std::error;
    use std::event;
    use std::option;
    use std::tx_context;
    use sui::transfer;
    use sui::object;
    use sui::coin;
    use sui::balance;

    // Declarăm un tip de Coin IBT
    struct IBT has drop, store {}

    // Funcție de init (doar exemplu)
    public entry fun init_ibt(ctx: &mut tx_context::TxContext) {
        // Orice logică de inițializare ai avea nevoie
        // De exemplu, să creezi ceva resource la publicare
    }

    // Funcție exemplu de mint
    public entry fun mint_ibt(
        amount: u64,
        ctx: &mut tx_context::TxContext
    ): coin::Coin<IBT> {
        coin::mint<IBT>(amount, ctx)
    }

    // Funcție exemplu de burn
    public entry fun burn_ibt(
        ibt_coin: coin::Coin<IBT>
    ) {
        coin::burn(ibt_coin);
    }
}
