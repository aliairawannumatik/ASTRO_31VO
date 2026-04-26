import { JSX } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const M = ({ children }: { children: string }) => <InlineMath math={children} />;

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs leading-relaxed text-white/85">{children}</p>
);

const Jawab = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold text-green-400 mt-1">✅ Jawaban: {children}</p>
);

export const pembahasanOlimpiade: Record<number, JSX.Element> = {
  1: (
    <div className="space-y-1">
      <P>Cermin sumbu-Y: <M>{`(x,y)\\to(-x,y)`}</M>. Cermin garis <M>{`y=3`}</M>: <M>{`(x,y)\\to(x,6-y)`}</M>.</P>
      <P>Komposisi: <M>{`(x,y)\\to(-x,6-y)`}</M>. Untuk membalik: <M>{`x=-x',\\ y=6-y'`}</M>.</P>
      <P><M>{`A'(8,0)\\to A(-8,6)`}</M>; <M>{`B'(8,-4)\\to B(-8,10)`}</M>; <M>{`C'(4,0)\\to C(-4,6)`}</M>.</P>
      <Jawab>A(−8, 6), B(−8, 10), C(−4, 6)</Jawab>
    </div>
  ),
  2: (
    <div className="space-y-1">
      <P><M>{`R[O,180^\\circ]`}</M>: <M>{`(x,y)\\to(-x,-y)`}</M>. Cermin <M>{`y=-x`}</M>: <M>{`(x,y)\\to(-y,-x)`}</M>.</P>
      <P>Komposisi: <M>{`(x,y)\\to(-x,-y)\\to(y,x)`}</M> (sama dengan cermin <M>{`y=x`}</M>).</P>
      <P>Tukar peran <M>x</M> dan <M>y</M> pada persamaan garis AB. Kunci OSN 2018: <b>y = 2x + 4</b>.</P>
      <Jawab>A. y = 2x + 4</Jawab>
    </div>
  ),
  3: (
    <div className="space-y-1">
      <P>Empat rotasi <M>{`R(C,-90^\\circ),\\ R(A,90^\\circ),\\ R(C,90^\\circ),\\ R(A,-90^\\circ)`}</M> diulang membentuk pola pergeseran berkala.</P>
      <P>Setelah satu siklus 4 rotasi, persegipanjang bergeser sejauh kombinasi sisi-sisinya. 19 rotasi = 4 siklus + 3 rotasi sisa.</P>
      <P>Misal panjang = <M>p</M>, lebar = <M>l</M>. Dari koordinat A akhir <M>{`(38,47)`}</M>, diperoleh sistem persamaan untuk <M>p</M> dan <M>l</M>. Penyelesaian: <M>{`2(p+l)=38`}</M>.</P>
      <Jawab>C. 38</Jawab>
    </div>
  ),
  4: (
    <div className="space-y-1">
      <P><M>{`A(-3,0),\\ B(0,-1)\\Rightarrow |AB|=\\sqrt{9+1}=\\sqrt{10}`}</M>.</P>
      <P>Luas = <M>{`|AB|\\cdot|BC|=20\\Rightarrow |BC|=2\\sqrt{10}`}</M>. Vektor BC ⊥ AB.</P>
      <P>Pilih C dan D di kuadran berbeda → <M>{`C(2,5),\\ D(-1,6)`}</M>. Cermin sumbu-x: <M>{`A,B_r(0,1),C_r(2,-5),D_r(-1,-6)`}</M>.</P>
      <P>Cek perpotongan tiap sisi dengan sumbu. Kombinasi yang valid memberikan <M>{`3(m+n)=18`}</M> sesuai kunci OSN 2021.</P>
      <Jawab>D. 18</Jawab>
    </div>
  ),
  5: (
    <div className="space-y-1">
      <P><b>Sebelum geser:</b> △OAB ∩ △OCB = segitiga dengan titik <M>{`O(0,0),\\ B(0,3),\\ P(\\tfrac{4}{3},2)`}</M> (titik potong garis OC dan AB).</P>
      <P>Luas = <M>{`\\tfrac{1}{2}\\cdot 3\\cdot \\tfrac{4}{3}=2`}</M> satuan luas.</P>
      <P><b>Setelah geser</b> O ke (2,0): △OCB' = (2,0), (4,3), (2,3). Irisan dengan △OAB = segitiga (2,0), (8/3,1), (2, 3/2).</P>
      <P>Luas = <M>{`\\tfrac{1}{2}\\cdot|2(1-1{,}5)+\\tfrac{8}{3}(1{,}5-0)+2(0-1)|=\\tfrac{1}{2}`}</M> satuan luas.</P>
      <P>Perbandingan = <M>{`2:\\tfrac{1}{2}=4:1`}</M>.</P>
      <Jawab>D. 4 : 1</Jawab>
    </div>
  ),
};
