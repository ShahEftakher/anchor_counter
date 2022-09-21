use anchor_lang::prelude::*;

declare_id!("HaHzYNLdsDwa14aVs5ejQVNU26qZN4w816WZoXR3t7h");

#[program]
pub mod anchor_counter {
    use super::*;

    //is it an instruction context
    pub fn initialize_counter(ctx: Context<InitializeCounter>, data: u64) -> Result<()> {
        //in order to update a data structure this is to be added as &mut
        let data_account = &mut ctx.accounts.data_account;
        data_account.counter = data;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let data_account = &mut ctx.accounts.data_account;
        data_account.counter += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        let data_account = &mut ctx.accounts.data_account;
        if data_account.counter == 0 {
            return err!(ZeroError::NoDecrement);
        }
        data_account.counter -= 1;
        Ok(())
    }

    pub fn set(ctx: Context<Set>, data: u64) -> Result<()> {
        let data_account = &mut ctx.accounts.data_account;
        data_account.counter = data;
        Ok(())
    }
}

//validation struct
//instruction validation struct i presume
//are these PDA as well???? i don't think so
//this is a data structure
#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub data_account: Account<'info, CounterAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub data_account: Account<'info, CounterAccount>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub data_account: Account<'info, CounterAccount>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut)]
    pub data_account: Account<'info, CounterAccount>,
}

//PDA
//Data account to the anchor_counter program
#[account]
pub struct CounterAccount {
    pub counter: u64,
}

#[error_code]
pub enum ZeroError {
    #[msg("Cannot decrease below Zero(0)")]
    NoDecrement
}