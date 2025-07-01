import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, completed } = await request.json();

  const { data, error } = await supabase
    .from('todos')
    .update({ title, completed })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ message: `Todo with id ${id} not found` }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: { id:string } }) {
  const { id } = params;

  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
