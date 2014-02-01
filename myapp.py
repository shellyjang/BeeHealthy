import os
from flask import Flask, render_template, request, jsonify
# import pandas as pd
import MySQLdb as mdb
import random 
import json

app = Flask(__name__)
db = mdb.connect(user="root", host="localhost", port=3306, db="cure_together")

def sqlExec(database, query):
    db = mdb.connect(user="root", host="localhost", port=3306, db=database)
    with db:
        cur = db.cursor(mdb.cursors.DictCursor)
        cur.execute(query)
        tables = cur.fetchall()
        return tables
        
def getWR(dictRow, v=0):
    m = float(dictRow.get("sum"))
    R = float(dictRow.get("avg_rating"))
    C = float(dictRow.get("Ctot"))
    newRow = dictRow
    newRow["WR"] = (m*R + v*C)/(m+v)
    return newRow
    
def randomTypeGenerator(dictRow):
    newRow = dictRow
    newRow["treatment_type"] = random.randint(0,3)
    # newRow["offer_url"] = "http://www.foundationcrossfit.com/"
    return newRow
    
def constructSQLquery(condition):
    # templateSQL = "SELECT tbl1.cond, tbl1.treatment, "
    # templateSQL =  templateSQL + "tbl1.major_improvement, tbl1.moderate_improvement, tbl1.no_effect, "
    # templateSQL =  templateSQL + "tbl1.slightly_worse, tbl1.much_worse, "
    # templateSQL =  templateSQL + "tbl1.Ctot, tbl1.sum, tbl1.avg_rating, "
    # templateSQL =  templateSQL + "ct_master_typeIdentified.url FROM "
    # templateSQL =  templateSQL + "(SELECT * FROM ct_master_filled_goodones WHERE cond='%s') tbl1 "
    # templateSQL = templateSQL + "INNER JOIN ct_master_typeIdentified "
    # templateSQL = templateSQL + "WHERE ct_master_typeIdentified.cond = tbl1.cond AND ct_master_typeIdentified.treatment = tbl1.treatment;"
    templateSQL = "SELECT * FROM ct_master_final WHERE cond = '%s'" 
    
    query = templateSQL %condition
    return query
    
def sortByVotesAlpha(condition, votes=10000, alpha=10.0):
    
    master_cols = ["cond",
                    "treatment", 
                    "major_improvement",
                    "moderate_improvement", 
                    "no_effect",
                    "slightly_worse",
                    "much_worse",
                    "sum",
                    "avg_rating",
                    "Ctot",
                    "treatment_type",
                    "url",
                    "img_url",
                    "price",
                    "reviews",
                    "title",
                    "description_1",
                    "description_2"]
    # print condition
    query = constructSQLquery(condition)
    out = sqlExec("cure_together", query)
    
    maxVotes = max([thing.get("sum") for thing in out])
    maxVotes = maxVotes * 10;
    
    ## the slider somehow only sets the values between 0 and 10. Have to normalize 
    votes = float(votes) * maxVotes / 10
    alpha = float(alpha) * 1 / 10
    ## alpha = 0 is the most popular, an alpha = 1 is the least popular. it's flipped on visual
    alpha = 1. - alpha;
    print 'alpha = %f, votes = %f' %(alpha, votes)
    
    # print len(out)
    if "WR" not in out[0].keys():
        out = map(lambda x: getWR(x, votes), out)
    out.sort(key = lambda x: x["WR"])
    out = out[::-1]
        
    l = len(out)
    alpha = int(l * alpha) 
    
    if alpha > l - 3:
        alpha = l - 3
    outRanked = out[alpha:alpha+3]
    ## If rank selected items are not longer than 3, fill it out with empty entry
    l = len(outRanked)
    if l < 3:
        for ii in range(3-l):
            addRow = outRanked[-1]
            addRow["cond"] = condition
            addRow["treatment_type"] = 5
            addRow["treatment"] = ""
            for jj in [2, 3, 4, 5, 6, 7, 8, 9, 13]:
                addRow[master_cols[jj]] = 0.0
            for jj in [11, 12, 14, 15, 16, 17]:
                addRow[master_cols[jj]] = ''
            outRanked = outRanked + [addRow]
    
    return (out, outRanked)

@app.route("/")
def hello():    
    return render_template('index2.html')     
    
@app.route("/search")
def searchIter():
    condition_query = request.args.get("condition","")
    # v1 = request.args.get("numVotes","")
    # v1 = float(v1)
    # alpha = request.args.get("ranked", "")
    # alpha = float(alpha)    
    (treatment_all, out) = sortByVotesAlpha(condition_query)
                
    return render_template('searchNew.html', out=out, cond=condition_query, jsonstr=treatment_all)

@app.route("/search_scaffold")
def searchIter2():
    condition_query = request.args.get("condition","")
    # v1 = request.args.get("numVotes","")
    # v1 = float(v1)
    # alpha = request.args.get("ranked", "")
    # alpha = float(alpha)    
    # condition_query = 'Knee Pain'
    (treatment_all, out) = sortByVotesAlpha(condition_query)
                
    return render_template('search_scaffold.html', out=out, cond=condition_query, jsonstr=treatment_all)

@app.route("/search_get")
def search_get():
    alpha = request.args.get('alpha','')
    votes = request.args.get('votes', '')
    alpha = float(alpha)
    votes = float(votes)    
    print votes, alpha
         
    condition_query = request.args.get('cond', '')
    (treatment_all, out) = sortByVotesAlpha(condition_query, votes, alpha)

    # data = mod.find_people_groups(skill_list)
    data = {"alpha": alpha, "votes": votes, "out": out, "treatment_all": treatment_all }
    return jsonify(data)    
    
# @app.route("/search.html")
# def search(v=0):
#     condition_query = 'Migraine'
#     templateSQL = "SELECT * FROM ct_master_filled_goodones WHERE cond = '%s'" 
#     out = sqlExec("cure_together", templateSQL %condition_query)
#     out = list(out)
#     v = 100
#     out = map(lambda x: getWR(x, v), out)
#     out.sort(key = lambda x: x["WR"])
#     out = out[::-1]
#     
#     return render_template('search.html', out=out[:12])
    
@app.route("/searchSmall.html")
def searchSmall():
    return render_template('searchSmall.html')
    
@app.route("/slides")
def slides():    
    return render_template('slides.html')
    
# @app.route("/search.html")
# def search():
#     
#     condition = request.args.get('condition', None)   
#     treatmentType = request.args.get('treatment_type', None)
#     
#     out = Jang.trueBayesianEstimate(condition)
#     out = out.sort(columns=['WR'], ascending=False)
#     result = list(out[:3]['treatment'])
#     
#     database = Jang.pullAmazonCure(condition)
#     if len(database) == 3:
#         amazonResult = list(database[:3]['img_url'])            
#         result = list(database[:3]['treatment'])
#     elif len(database) == 6:
#         amazonResult = list(database[0:6:2]['img_url'])            
#         result = list(database[0:6:2]['treatment'])
#     else:
#         amazonResult = [list(database[0:9:3]['img_url']), map(Jang.starURL, list(database[0:9:3]['amazon_rating']))  ]            
#         result = list(database[0:9:3]['treatment'])
#     
#     offerURL = list(database[0:9:3]['offer_url'])
#     
#     database2 = Jang.pullYelpCure(condition)
#     yelpResult = database2.to_dict()
#     
#         
#     address = [yelpResult.get('address').get(ii) for ii in range(3)]
#     addresses = map(lambda x: ','.join(x.split(' ')), address)
#     
#     mapURL = "http://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap&" + \
#         "markers=color:green%7Clabel:A%7C" + addresses[0] + "&" + \
#         "markers=color:green%7Clabel:B%7C" + addresses[1] + "&" + \
#         "markers=color:green%7Clabel:C%7C" + addresses[2] + "&" + \
#         "sensor=false"
#         
#     return render_template('search.html', condition=condition, result=result, amazonResult=amazonResult, offerURL=offerURL, treatmentType=treatmentType, yelpResult=yelpResult, baseMapURL=mapURL)

@app.route('/<pagename>') 
def regularpage(pagename=None): 
    """ 
    Route not found by the other routes above. May point to a static template. 
    """ 
    return "You've arrived at " + pagename
    #if pagename==None: 
    #    raise Exception, 'page_not_found' 
    #return render_template(pagename) 

if __name__ == '__main__':
    print "Starting debugging server."
    app.run(debug=True, host='localhost', port=8000)


