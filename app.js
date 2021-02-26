//file app.js !!! BKD5   !!!
//membuat database idb bernama dbproduk
let dbprom = idb.open('dbproduk', 1, (db) => {
    console.log('pembuatan database= ', db);
    //buat objectstore ==> table
    db.createObjectStore('produk', {
        keyPath: 'id',
        autoIncrement: true
    });
    //buat index agar mempercepat pencarian
    let dbStore = db.transaction.objectStore('produk');
    dbStore.createIndex('id', 'id', {
        unique: true
    });
    dbStore.createIndex('nama', 'nama');
});

//membuat fungsi untuk menyimpan data (menambah)
function simpanData(id, nama, stok, harga, deskripsi) {
    let tx = undefined;
    if (id == 0) {
        dbprom.then((db) => {
            tx = db.transaction('produk', 'readwrite'); //buka transaksi
            let dbstore = tx.objectStore('produk');     //pilih store ==>table
            return dbstore.add({                        //tambahkan data dengan fungsi add
                nama: nama,
                stok: stok,
                harga: harga,
                deskripsi: deskripsi
            });
        }).then(() => {
            console.log('data berhasil ditambahkan');
        }).catch((e) => {
            tx.abort();
            console.log('error menambahkan ' + e);
        })
    } else{          //jika data disimpan dalam mode ubah
        dbprom.then((db) => {
            tx = db.transaction('produk', 'readwrite'); //buka transaksi
            let dbstore = tx.objectStore('produk');     //pilih store ==>table
            return dbstore.put({                        //ubah data dengan fungsi put
                id: id,
                nama: nama,
                stok: stok,
                harga: harga,
                deskripsi: deskripsi
            });
        }).then(() => {
            console.log('data berhasil diubah');
        }).catch((e) => {
            tx.abort();
            console.log('error mengubah ' + e);
        })
    }
}

//memanggil fungsi untuk menyimpan data ketika tombol simpan di klik
document.querySelector('#bMSimpan').addEventListener('click', () => {  //ketika bMSimpan diklik
    nama = document.querySelector('#eNama').value;          //ambil nama 
    harga = document.querySelector('#eHarga').value;        //ambil harga
    stok = document.querySelector('#eStok').value;          //ambil stok
    deskripsi = document.querySelector('#eDeskripsi').value;//ambil deskripsi
    id = document.querySelector('#eId').value;              //ambil id
    simpanData(parseInt(id), nama, stok, harga, deskripsi); //panggil fungsi simpan
    console.log(nama, harga, stok, deskripsi);
    tampilData();                                           //tampilkan data
});

//fungsi untuk menampilkan data  ke tabel
function tampilData() {
    let html = '';
    dbprom.then((db) => {
        let tx = db.transaction('produk');   //buat transaksi
        let dbStore = tx.objectStore('produk');//pilih tabel
        let index = dbStore.index('id');        //ambil by index
        return index.openCursor();              //buka cursor
    }).then(function next(cursor) {             //untuk setiap cursor ambil baris satu demi satu
        if (!cursor) { //jika sudah di bagian paling akhir, tampilkan ke tbody
            //console.log('html ' + html);
            document.querySelector('#tbody').innerHTML = html;
            return;
        }
        //jika belum berakhir
        html += `<tr>        
            <td>${cursor.value.nama}</td>
            <td>${cursor.value.harga}</td>
            <td>${cursor.value.stok}</td>
            <td>${cursor.value.deskripsi}</td>
            <td><button type="button" id="bEdit" onclick="ambilId(${cursor.value.id})" class="btn btn-primary">Edit</button></td></tr>`;
        return cursor.continue().then(next);
    })
}
//panggil fungsi agar saat halaman muncul, tampilan langsung dibuat
tampilData();
//membuat fungsi untuk ambil satu data
function ambilId(id) {
    dbprom.then((db) => {
        let tx = db.transaction('produk');          //buat obj transaksi
        let dbStore = tx.objectStore('produk');     //pilih table
        let index = dbStore.index('id');            //pilih index
        return index.get(id);                       //cari berdasarkan index
    }).then((data) => {
        $('#eNama').val(data.nama);                 //masukan hasil pencarian ke tampilan form nama
        $('#eHarga').val(data.harga);               //masukan hasil pencarian ke tampilan form harga
        $('#eStok').val(data.stok);
        $('#eDeskripsi').val(data.deskripsi);
        $('#eId').val(data.id);                     //!! eId diset dengan suatu nilai id yang akan diubah
        $('#modForm').modal('show');                //tampilkan modal
    }).catch((err) => {
        console.log('error ' + err);
    })
}

//menghapus data
function hapusData(id){
    var jawab = confirm('yakin akan menghapus ?');
    if(jawab){
         dbprom.then((db) => {
            tx = db.transaction('produk', 'readwrite'); //buka transaksi
            let dbstore = tx.objectStore('produk');     //pilih store ==>table
            return dbstore.delete(parseInt(id));        //hapus id terpilih
        }).then(() => {
            console.log('data berhasil dihapus');
        }).catch((e) => {
            tx.abort();
            console.log('error menghapus ' + e);
        });
        tampilData();
    }
}

//membuat aksi ketika tombol hapus diklik
document.querySelector('#bMHapus').addEventListener('click',()=>{
    id = document.querySelector('#eId').value;
    hapusData(id);
})
//cek apakah mendukung notifikasi
if ('Notification' in window) {
    console.log('notif didukung');
  } else {
    alert('notifikasi tidak didukung');
  }
  //minta ijin
  Notification.requestPermission((status) => {
   console.log('status ijin', status);
  })
  
  //membuat notifikasi
  document.querySelector('#notifikasi').addEventListener('click',()=>{
      if(Notification.permission == 'granted'){
          navigator.serviceWorker.getRegistration().then((reg)=>{
              reg.showNotification('pesan baru');
          });
      }
  })



