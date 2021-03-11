import requests,sys
from lxml import etree
sys.path.append('D:\\vscode\\projects\\bookstore\\pythons')
from my_database import Mongo

class shouye:
    def __init__(self):
        self.url = 'http://m.bookschina.com/home/index'
        self.session = requests.Session()
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'}
        self.html = self.parse_url()
        self.mongo = Mongo('bookstore','swipper')
    def parse_url(self):
        res = self.session.get(self.url,headers=self.headers)
        text = res.text
        res.close()
        html = etree.HTML(text)
        return html

    def get_swipper(self,dir_name):
        data = self.html.xpath('//div[@class="swiper-slide"]/a/img/@src | //div[@class="swiper-slide"]/a/img/@alt')
        res = []
        middle = []
        j = 1
        for i in data:
            middle.append(i)
            if j%2==0:
                res.append(middle)
                j=0
                middle = []
            j = j+1
        for item in res:
            self.save_image(item[0],dir_name,item[1])
    

    def save_image(self,img_url,dir_name,img_alt):
        res = requests.get(img_url,headers=self.headers)
        content = res.content
        res.close()
        img_name =img_url.split('/')[-2] + img_url.split('/')[-1]
        img_name = img_name.split('?')[0]
        with  open(dir_name + '\\'+img_name,'wb') as f:
            f.write(content)
            self.mongo.insert_one({"img_name":img_name,"img_alt":img_alt})
            print(img_alt + '下载成功' + img_url)
    # http://m.bookschina.com/Content/images/changxiaobang.png
    def get_sort(self,dir_name):
        img_url = self.html.xpath('//ul[@class="index-nav"]/li/a/img/@src')
        sort = self.html.xpath('//ul[@class="index-nav"]/li/a/b/text()')
        for i in range(0,len(sort)):
            img_final_url = 'http://m.bookschina.com' + img_url[i]
            res = requests.get(img_final_url,headers=self.headers)
            content = res.content
            res.close()
            img_name = img_url[i].split('/')[-1]
            with open(dir_name + '\\' +img_name,'wb') as f:
                f.write(content)
                self.mongo.insert_one({"img_name":img_name,"sort":sort[i]})
                print(sort[i] + "完成")
    

    def get_today_book(self,dir_name):
        # m = Mongo('bookstore','today_book')
        detail_urls = self.html.xpath('//div[@class="newBookList"]/ul/li/a/@href')
        small_img_urls = self.html.xpath('//div[@class="newBookList"]/ul/li/a/div[@class="bookWrap"]/div/img/@data-original')
        for item in range(0,len(small_img_urls)):
            self.get_today_book_detail(detail_urls[item],small_img_urls[item],dir_name)
    
    def get_today_book_detail(self,detail_url,small_img_url,dir_name):
        detail_url = 'http://m.bookschina.com' + detail_url
        res = self.session.get(detail_url,headers=self.headers)
        html = etree.HTML(res.text)
        res.close()
        big_img_urls = html.xpath('//div[@class="bookPic"]/img/@src')[0]
        book_name = html.xpath('//div[@class="bookPic"]/img/@alt')[0]
        book_info = html.xpath('//div[@class="bookInfor"]/p/text()')
        price = html.xpath('//span[@class="price"]/text()')[0]
        original_price = html.xpath('//span[@class="originalPrice"]/text()')[0]
        active_list = html.xpath('//div[@class="activeList"]/a/text()')
        ads_list = html.xpath('//div[@class="floorBanner"]/div/div/div/a/img/@src')
        ads_img_name_list = []
        for item in ads_list:
            ads_img_name = item.split('/')[-2] + item.split('/')[-1]
            ads_img_name = ads_img_name.split('?')[0]
            ads_img_name_list.append(ads_img_name)
        service = html.xpath('//div[@class="service"]/ul/li/text()')
        reminder = html.xpath('//div[@class="reminder"]/p/text()')
        if reminder==[]:
            reminder = ['-1']
        reminder = reminder[0]
        inforLink = html.xpath('//div[@class="inforLinkItem"]/a/text()')
        book_NO = html.xpath('//div[@class="inforLinkItem"]/a/i/text()')
        if book_NO==[]:
            book_NO = ['-1']
        book_NO = book_NO[0]
        baseInfor = html.xpath('//div[@class="baseInfor"]/ul/li/text()')# 图文详情
        characteristic = html.xpath('//div[@class="detailList"][1]/p/text()') # 特色
        if characteristic==[]:
            characteristic = ['-1']
        book_interview = html.xpath('//div[@class="detailList"][2]/p/text()') # 介绍
        if book_interview == []:
            book_interview = characteristic[0]
        characteristic = ','.join(characteristic).replace(' ','')
        characteristic = []
        book_mulu = html.xpath('//div[@id="catalogSwitch"]/text()')
        book_mulus = []
        if book_mulu == []:
            book_mulu = ['-1']
        for item in book_mulu:
            book_mulus.append(item.replace(' ','').replace('\n','').replace('\r',''))
        author_interview = html.xpath('//div[@class="detailList"][last()]/p/text()')
        res1 = requests.get(small_img_url,headers=self.headers)
        content1 = res1.content
        res1.close()
        small_img_name =  small_img_url.split('/')[-3] + small_img_url.split('/')[-2] + small_img_url.split('/')[-1]
        big_img_name = big_img_urls.split('/')[-3] + big_img_urls.split('/')[-2] + big_img_urls.split('/')[-1]
        
        with open(dir_name + '\\' + small_img_name,'wb') as f:
            f.write(content1)
        res2 = requests.get(big_img_urls,headers=self.headers)
        content2 = res2.content
        res2.close()
        with open(dir_name + '\\' + big_img_name,'wb') as f:
            f.write(content2)
        for i in range(0,len(ads_list)):
            res3 = requests.get(ads_list[i],headers=self.headers)
            content3 = res3.content
            res3.close()
            with open(dir_name + '\\' + ads_img_name_list[i],'wb') as f:
                f.write(content3)
        m = Mongo('bookstore','popular_book')
        m.insert_one({"sort":"艺术","page": 1,"small_img_name":small_img_name,"big_img_name":big_img_name,"book_name":book_name,"book_info":book_info,"price":price,"original_price":original_price,"reminder":reminder,"inforLink":inforLink,"active_list":active_list,"ads_img_name_list":ads_img_name_list,"book_NO":book_NO,"baseInfor":baseInfor,"characteristic":characteristic,"book_interview":book_interview,"book_mulus":book_mulus,"author_interview":author_interview,"service":service})
        print(book_name + '完成')
    
    def get_today_book_more(self,dir_name):
        res = self.session.get('http://m.bookschina.com/Books/NewTeHui',headers=self.headers)
        html = etree.HTML(res.text)
        res.close()
        detail_urls = html.xpath('//div[@class="bookLIst"]/ul/li/a/@href')
        small_img_urls = html.xpath('//div[@class="bookLIst"]/ul/li/a/div[@class="bookWrap"]/div/img/@data-original')
        for i in range(6,len(detail_urls)):
            self.get_today_book_detail(detail_urls[i],small_img_urls[i],dir_name)
    
    def get_book_sort(self,dir_name,params):# popular_book
        res = self.session.post('http://m.bookschina.com/home/changxiao',headers=self.headers,params=params)
        html = etree.HTML(res.text)  # 文学,社科，少儿，艺术
        text = res.text
        res.close()
        detail_urls = html.xpath('//li/a/@href')
        small_img_urls = html.xpath('//li/a/div[@class="bookWrap"]/div/img/@data-original')
        for i in range(0,len(detail_urls)):
            if small_img_urls[i] == '':
                small_img_urls[i] = 'http://m.bookschina.com/Content/images/nopic.jpg'
            self.get_today_book_detail(detail_urls[i],small_img_urls[i],dir_name)
        





if __name__ == "__main__":
    s = shouye()
    # s.get_today_book('D:\\vscode\\projects\\bookstore\\server\\image\\shouye\\detail')
    # s.get_today_book_more('D:\\vscode\\projects\\bookstore\\server\\image\\shouye\\detail')
    s.get_book_sort('D:\\vscode\\projects\\bookstore\\server\\image\\shouye\\wenxue',{"flh":"yishu","page":1,"type":"html"})
        

