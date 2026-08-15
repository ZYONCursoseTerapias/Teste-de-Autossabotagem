alter table public.sabotagem_results
add column if not exists telefone text;

alter table public.sabotagem_results enable row level security;

revoke select, update, delete on table public.sabotagem_results from anon, authenticated;
grant insert on table public.sabotagem_results to anon, authenticated;

drop policy if exists "cadastro_publico_resultados" on public.sabotagem_results;
create policy "cadastro_publico_resultados"
on public.sabotagem_results
for insert
to anon, authenticated
with check (true);
