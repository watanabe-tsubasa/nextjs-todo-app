import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/* ---------- PUT /api/todos/[id] ---------- */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /* ❶ ルートパラメータを await */
  const { id } = await params;

  /* ❷ Body から更新フィールドを取得 */
  const { title, completed } = await request.json();

  /* ❸ Supabase で更新 */
  const { data, error } = await supabase
    .from('todos')
    .update({ title, completed })
    .eq('id', id)
    .select()
    .single(); // ← 1行だけ欲しいと明示

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ message: `Todo ${id} not found` }, { status: 404 });
  }

  return NextResponse.json(data);
}

/* ---------- DELETE /api/todos/[id] ---------- */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /* 204 No Content を返すときは body を省略 */
  return new NextResponse(null, { status: 204 });
}
