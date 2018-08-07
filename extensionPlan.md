url ---> kuralın toplandığı url
reference ---> değerlerin oluşturacağı şablon
url-modification ---> değerin okunabilmesi için gerekli olan url değişikleri yada js cağırmaları,
js olaylarının kontrolu için selenium geliştirmesi
select-element --->{
              ilk işaret --> {
                        -eşsiz: sayfa içerisinde 1 tane bulunup çekilmek istenen değer ::mavi
                        -tekrarlı: sayfa içerisinde birden fazla bulunan yapılar       ::kırmızı
              }
              ikincil işaret -->{
                        -seçimReferamsı
                                ::metin -->eşsiz
                                ::attribute -->class:tekrarlı -->id:eşsiz
                                ::tag --> tekrarlı
                        -seçimTipi
                                ::metin
                                ::attribute ---> class selector:: seçilen sınıfa sahip elmentleri boyar ::turuncu
                                ::işaret --> eşsiz seçimlerde ayıklanamayan durumlar için
              }
              veri-önizleme -->{
                        -kuralabağlı çekilecek verinin ön izlemesi ---> js xpath sorgusu
              }

    }