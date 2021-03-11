import requests,sys
from lxml import etree
sys.path.append('D:\\vscode\\projects\\bookstore\\pythons')
from my_database import Mongo

class Sort:
    def __init__(self):
        self.url = 'http://m.bookschina.com/books/kindlist'
        self.session = requests.Session()
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'}
        self.html = self.parse_url()
        self.sort_url = 'http://m.bookschina.com/Books/KindListJson'
        self.mongo = Mongo('bookstore','sort')
        self.m = Mongo('bookstore','sort_book')
    def parse_url(self):
        res = self.session.get(self.url,headers=self.headers)
        html = etree.HTML(res.text)
        res.close()
        return html
    def get_ID(self,dir_name):
        id_list = self.html.xpath('//ul[@id="ulFoot"]/li/a/@data-id')
        sort_name_list = self.html.xpath('//ul[@id="ulFoot"]/li/a/text()')
        for i in range(0,len(id_list)):
            item = int(id_list[i])
            self.get_sort(item,sort_name_list[i],dir_name)
            break
    def get_sort(self,id,sort,dir_name):
        res = self.session.post(self.sort_url,params={"categoryId":id},headers=self.headers)
        json = res.json()['data']
        res.close()
        
        for item in json:
            r = requests.get(item['Pic'],headers=self.headers)
            content = r.content
            r.close()
            url = item['Pic']
            pic_name = url.split('/')[-2] + url.split('/')[-1]
            category_id = item['CategoryID']
            with open(dir_name + '\\' + pic_name,'wb') as f: #http://m.bookschina.com/kinder/54110000
                f.write(content)
                self.mongo.insert_one({"category_id":category_id,"sort":sort,"category_name":item['CategoryName'],"img_name":pic_name})
                self.get_child_sort(category_id,dir_name)
                print(item['CategoryName']+'类完成')
    
    def get_child_sort(self,id,dir_name):
        res = self.session.get('http://m.bookschina.com/kinder/{}'.format(id),headers=self.headers)
        html = etree.HTML(res.text)
        res.close()
        detail_urls = html.xpath('//ul[@class="J_listInner"]/li/a/@href')
        small_img_urls = html.xpath('//ul[@class="J_listInner"]/li/a/div/div/img/@data-original')
        for i in range(0,len(detail_urls)):
            self.get_today_book_detail(detail_urls[i],small_img_urls[i],dir_name,id)
    

    def get_today_book_detail(self,detail_url,small_img_url,dir_name,category_id):
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
        self.m.insert_one({"category_id":category_id,"page": 1,"small_img_name":small_img_name,"big_img_name":big_img_name,"book_name":book_name,"book_info":book_info,"price":price,"original_price":original_price,"reminder":reminder,"inforLink":inforLink,"active_list":active_list,"ads_img_name_list":ads_img_name_list,"book_NO":book_NO,"baseInfor":baseInfor,"characteristic":characteristic,"book_interview":book_interview,"book_mulus":book_mulus,"author_interview":author_interview,"service":service})
        print(book_name + '完成')



if __name__ == "__main__":
    s = Sort()
    s.get_ID('D:\\vscode\\projects\\bookstore\\server\\image\\shouye\\sort')