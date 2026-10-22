import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'materi';

export const DEFAULT_CONTENT = {
  hanoi: {
    title: 'Menara Hanoi',
    description:
      'Rekursi klasik yang menggunakan prinsip divide & conquer dan dapat dibuktikan secara matematis dengan induksi. Pindahkan n piringan dari tiang A ke tiang C dengan bantuan tiang B.',
    formula: 'T(0) = 0\nT(n) = 2·T(n−1) + 1\n\n∴ T(n) = 2ⁿ − 1',
    proof:
      'Basis: T(1) = 1 = 2¹ − 1 ✓\nHipotesis: Misal T(k) = 2ᵏ − 1\nInduksi: T(k+1) = 2·T(k) + 1 = 2(2ᵏ−1) + 1 = 2ᵏ⁺¹ − 1 ✓',
    code: `void hanoi(int n, String a, String c, String b) {
  if (n == 0) return;
  hanoi(n - 1, a, b, c);
  print('Pindah $n: $a -> $c');
  hanoi(n - 1, b, c, a);
}

void main() {
  var n = 3;
  hanoi(n, 'A', 'C', 'B');
  print('Total: \${(1 << n) - 1} langkah');
}`,
    rules: [
      'Pindahkan n piringan dari tiang A → C dengan bantuan tiang B',
      'Satu kali pindah hanya boleh 1 piringan',
      'Piringan besar tidak boleh di atas piringan kecil',
    ],
    steps: [
      'Pindahkan n−1 piringan teratas dari A → B',
      'Pindahkan piringan terbesar dari A → C',
      'Pindahkan n−1 piringan dari B → C',
    ],
  },
  palindrom: {
    title: 'Palindrom',
    description:
      'String atau angka yang dibaca dari depan maupun belakang memberikan hasil yang sama. Contoh: "katak", "madam", 12321. Kompleksitas: O(n) waktu, O(1) memori (teknik two pointers).',
    formula: 's[i] = s[n−1−i]\n∀ i dari 0 sampai ⌊n/2⌋',
    formulaNumber:
      'n palindrom jika:\nreverse(n) = n\n\ndigit = n % 10\nrev = rev×10 + digit\nn = n / 10',
    code: `void main() {
  String kata = 'kasur';
  String terbalik = kata.split('').reversed.join('');
  
  if (kata == terbalik) {
    print ('palindrom');
  }
  else {
    print ('bukan palindrom');
  }
}`,
  },
  prima: {
    title: 'Bilangan Prima',
    description:
      'Bilangan bulat p > 1 yang faktor positifnya hanya 1 dan p sendiri. Contoh: 2, 3, 5, 7, 11. Catatan: 2 satu-satunya prima genap, dan 1 bukan prima.',
    formula: 'n = a × b (komposit)\n⟹ min(a,b) ≤ √n\n\nJika a,b > √n:\na×b > n ✗ (kontradiksi)',
    code: `void main() {
  var data = '7 10 13 20 29';

  for (var s in data.split(' ')) {
    var n = int.parse(s);
    var prima = n > 1;

    for (var i = 2; i * i <= n; i++) {
      if (n % i == 0) {
        prima = false;
        break;
      }
    }

    if (prima) {
      print('\$n prima');
    } else {
      print('\$n bukan prima');
    }
  }
}`,
  },
  pascal: {
    title: 'Segitiga Pascal',
    description:
      'Tiap angka = jumlah dua angka di atasnya, tepi selalu 1. Angka di baris ke-n, posisi ke-k adalah koefisien binomial C(n,k) = n! / (k!·(n−k)!).',
    formula: 'C(n,k) = n! / (k! · (n−k)!)\n\nRekurens: C(n,k) = C(n−1,k−1) + C(n−1,k)\nC(n,0) = C(n,n) = 1',
    binomial: '(a+b)³ = 1·a³ + 3·a²b + 3·ab² + 1·b³\n       = a³ + 3a²b + 3ab² + b³',
    code: `void main() {
  var baris = [1];

  for (var i = 0; i < 6; i++) {
    print(baris.join(' '));

    var baru = [1];
    for (var j = 1; j < baris.length; j++) {
      baru.add(baris[j - 1] + baris[j]);
    }
    baru.add(1);
    baris = baru;
  }
}`,
    properties: [
      'Jumlah baris ke-n = 2ⁿ',
      'Simetris: C(n,k) = C(n,n−k)',
      'Koefisien ekspansi binomial: (a+b)ⁿ = Σ C(n,k)·aⁿ⁻ᵏ·bᵏ',
    ],
  },
};

/**
 * Real-time subscription menggunakan onSnapshot langsung.
 * Jika dokumen belum ada, seed dengan default content.
 * Callback dipanggil SETIAP ADA PERUBAHAN dari siapapun.
 */
export function subscribeMateri(slug, onData, onError) {
  const ref = doc(db, COLLECTION, slug);

  return onSnapshot(
    ref,
    async (snap) => {
      if (!snap.exists()) {
        // Pertama kali — seed default content ke Firestore
        try {
          await setDoc(ref, {
            ...DEFAULT_CONTENT[slug],
            _seeded: true,
            _updatedAt: serverTimestamp(),
          });
          // onSnapshot akan otomatis trigger lagi setelah setDoc
        } catch (e) {
          onError?.(e);
        }
      } else {
        onData(snap.data());
      }
    },
    (error) => {
      console.error('Firestore onSnapshot error:', error);
      onError?.(error);
    }
  );
}

/**
 * Simpan field tertentu — merge agar field lain tidak hilang.
 * Firestore otomatis push update ke SEMUA subscriber (onSnapshot) secara real-time.
 */
export async function saveField(slug, field, value) {
  const ref = doc(db, COLLECTION, slug);
  await setDoc(
    ref,
    {
      [field]: value,
      _updatedAt: serverTimestamp(),
      _updatedBy: 'user',
    },
    { merge: true }
  );
}
