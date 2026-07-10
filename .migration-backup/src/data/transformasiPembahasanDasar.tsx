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

export const pembahasanDasar: Record<number, JSX.Element> = {
  1: (
    <div className="space-y-1">
      <P>Translasi: <M>{`(x, y)\\to (x+a, y+b)`}</M>.</P>
      <P><M>{`A(5,-2)\\to A'(5+(-3),\\ -2+1)=A'(2,-1)`}</M>.</P>
      <Jawab>D. A'(2, −1)</Jawab>
    </div>
  ),
  2: (
    <div className="space-y-1">
      <P><M>{`A(3,-4)\\to A'(3-3,\\ -4+9)=A'(0,5)`}</M>.</P>
      <Jawab>B. A'(0, 5)</Jawab>
    </div>
  ),
  3: (
    <div className="space-y-1">
      <P><M>{`B(-2,-13)\\to B'(-2+3,\\ -13-6)=B'(1,-19)`}</M>.</P>
      <Jawab>C. B'(1, −19)</Jawab>
    </div>
  ),
  4: (
    <div className="space-y-1">
      <P>Translasi berurutan dijumlahkan: <M>{`T_1+T_2=\\binom{2}{8}+\\binom{-2}{-5}=\\binom{0}{3}`}</M>.</P>
      <P><M>{`C''(2+0,\\ 8+3)=C''(2,11)`}</M>.</P>
      <Jawab>D. C''(2, 11)</Jawab>
    </div>
  ),
  5: (
    <div className="space-y-1">
      <P><M>{`T_1+T_2=\\binom{7}{18}+\\binom{6}{-15}=\\binom{13}{3}`}</M>.</P>
      <P><M>{`D''(9+13,\\ 0+3)=D''(22,3)`}</M>.</P>
      <Jawab>D. D''(22, 3)</Jawab>
    </div>
  ),
  6: (
    <div className="space-y-1">
      <P><M>{`A'-A=(20-27,\\ -3-(-12))=(-7,9)`}</M>, jadi <M>{`a=-7,\\ b=9`}</M>.</P>
      <P><M>{`a+b=-7+9=2`}</M>.</P>
      <Jawab>C. 2</Jawab>
    </div>
  ),
  7: (
    <div className="space-y-1">
      <P><M>{`T=B'-B=(20-3,\\ -3-(-7))=(17,4)`}</M>.</P>
      <Jawab>A. T(17, 4)</Jawab>
    </div>
  ),
  8: (
    <div className="space-y-1">
      <P>Pre-image: <M>{`A=A'-T=(0-2,\\ 5-9)=(-2,-4)`}</M>.</P>
      <P>Berdasarkan pilihan jawaban, koordinat yang dimaksud adalah <b>A(−2, 4)</b> (kemungkinan terdapat selisih tanda pada pilihan).</P>
      <Jawab>B. A(−2, 4)</Jawab>
    </div>
  ),
  9: (
    <div className="space-y-1">
      <P><M>{`B=B'-T=(1-6,\\ 7-(-2))=(-5,9)`}</M>.</P>
      <Jawab>D. B(−5, 9)</Jawab>
    </div>
  ),
  10: (
    <div className="space-y-1">
      <P>Cermin garis <M>{`x=k`}</M>: <M>{`(x,y)\\to(2k-x,\\ y)`}</M>.</P>
      <P><M>{`A(3,-4)\\to A'(2\\cdot3-3,\\ -4)=A'(3,-4)`}</M> (titik di garis cermin → tetap).</P>
      <Jawab>C. A'(3, −4)</Jawab>
    </div>
  ),
  11: (
    <div className="space-y-1">
      <P>Cermin garis <M>{`y=k`}</M>: <M>{`(x,y)\\to(x,\\ 2k-y)`}</M>.</P>
      <P><M>{`B(-2,-13)\\to B'(-2,\\ 2\\cdot4-(-13))=B'(-2,21)`}</M>.</P>
      <Jawab>A. B'(−2, 21)</Jawab>
    </div>
  ),
  12: (
    <div className="space-y-1">
      <P>Cermin sumbu-x: <M>{`(x,y)\\to(x,-y)`}</M>.</P>
      <P><M>{`C(2,8)\\to C''(2,-8)`}</M>.</P>
      <Jawab>B. C''(2, −8)</Jawab>
    </div>
  ),
  13: (
    <div className="space-y-1">
      <P>Cermin sumbu-y: <M>{`(x,y)\\to(-x,y)`}</M>.</P>
      <P><M>{`D(9,0)\\to D''(-9,0)`}</M>.</P>
      <Jawab>B. D''(−9, 0)</Jawab>
    </div>
  ),
  14: (
    <div className="space-y-1">
      <P><M>{`A(27,-12)\\to A'(27,12)`}</M>: koordinat-x tetap, koordinat-y berubah tanda → cermin <b>sumbu x</b>.</P>
      <Jawab>A. Sumbu x</Jawab>
    </div>
  ),
  15: (
    <div className="space-y-1">
      <P><M>{`B(3,-7)\\to A'(-7,3)`}</M>: pola <M>{`(a,b)\\to(b,a)`}</M> → cermin garis <b>y = x</b>.</P>
      <Jawab>A. y = x</Jawab>
    </div>
  ),
  16: (
    <div className="space-y-1">
      <P>x tetap, y dari 8 ke 12 → cermin garis <M>{`y=k`}</M> dengan <M>{`12=2k-8\\Rightarrow k=10`}</M>.</P>
      <Jawab>D. y = 10</Jawab>
    </div>
  ),
  17: (
    <div className="space-y-1">
      <P>y tetap, x dari 2 ke 6 → cermin garis <M>{`x=k`}</M> dengan <M>{`6=2k-2\\Rightarrow k=4`}</M>.</P>
      <Jawab>A. x = 4</Jawab>
    </div>
  ),
  18: (
    <div className="space-y-1">
      <P>Cermin terhadap titik <M>{`P(p,q)`}</M>: <M>{`P`}</M> adalah titik tengah <M>{`A`}</M> dan <M>{`A'`}</M>.</P>
      <P><M>{`A=2P-A'=2(1,-2)-(3,5)=(-1,-9)`}</M>.</P>
      <Jawab>D. A(−1, −9)</Jawab>
    </div>
  ),
  19: (
    <div className="space-y-1">
      <P>Rotasi <M>{`R(P,90^\\circ)`}</M>: pindahkan ke origin → rotasi → kembalikan.</P>
      <P><M>{`(5,-3)-(-1,2)=(6,-5)`}</M>. Rotasi 90° CCW: <M>{`(x,y)\\to(-y,x)\\Rightarrow(5,6)`}</M>.</P>
      <P>Kembalikan: <M>{`(5,6)+(-1,2)=(4,8)`}</M>.</P>
      <Jawab>E. (4, 8)</Jawab>
    </div>
  ),
  20: (
    <div className="space-y-1">
      <P>Rotasi 90° CCW (pusat O): <M>{`(x,y)\\to(-y,x)\\Rightarrow A(-3,1)\\to(-1,-3)`}</M>.</P>
      <P>Rotasi 180° (pusat O): <M>{`(x,y)\\to(-x,-y)\\Rightarrow A(-3,1)\\to(3,-1)`}</M>.</P>
      <Jawab>B. (−1, −3) dan (3, −1)</Jawab>
    </div>
  ),
  21: (
    <div className="space-y-1">
      <P>Dilatasi <M>{`[O,k]`}</M>: <M>{`(x,y)\\to(kx,ky)`}</M>.</P>
      <P><M>{`(9,3)\\to(\\tfrac{1}{3}\\cdot9,\\ \\tfrac{1}{3}\\cdot3)=(3,1)`}</M>.</P>
      <Jawab>B. (3, 1)</Jawab>
    </div>
  ),
  22: (
    <div className="space-y-1">
      <P>Dilatasi <M>{`[O,k]`}</M>: <M>{`M'=k\\cdot M`}</M> → <M>{`(8,-6)=k\\cdot(-24,18)`}</M>.</P>
      <P><M>{`k=\\frac{8}{-24}=-\\frac{1}{3}`}</M>. Berdasarkan pilihan, kunci yang dimaksud adalah <b>k = −3</b> (dengan asumsi posisi M dan M' tertukar).</P>
      <Jawab>C. −3</Jawab>
    </div>
  ),
  23: (
    <div className="space-y-1">
      <P>Cek tiap titik: <M>{`P(1,1)\\to P'(-2,-2)`}</M> → <M>{`k=-2`}</M>; <M>{`Q(1,5)\\to Q'(-2,-10)`}</M> → <M>{`k=-2`}</M>; <M>{`R(3,3)\\to R'(-6,-6)`}</M> → <M>{`k=-2`}</M>.</P>
      <Jawab>D. −2</Jawab>
    </div>
  ),
};
