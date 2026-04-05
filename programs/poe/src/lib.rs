use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWxTWqkZq8ShWm6ihcK3a8bJc7UU");

#[program]
pub mod proof_of_effort {
    use super::*;

    pub fn submit_effort(
        ctx: Context<SubmitEffort>,
        effort_hash: String,
        score: u64,
    ) -> Result<()> {
        let effort_record = &mut ctx.accounts.effort_record;
        effort_record.user = ctx.accounts.user.key();
        effort_record.effort_hash = effort_hash;
        effort_record.score = score;
        effort_record.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SubmitEffort<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init, payer = user, space = 8 + EffortRecord::INIT_SPACE)]
    pub effort_record: Account<'info, EffortRecord>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct EffortRecord {
    pub user: Pubkey,
    #[max_len(64)]
    pub effort_hash: String,
    pub score: u64,
    pub timestamp: i64,
}
