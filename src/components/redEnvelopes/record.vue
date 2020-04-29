<template>
  <div class='record'>
    <div class='recordBox'></div>
    <ul class='recordList'>
      <li v-for="a in 15">
        <div class='listTitle'>
          <span>红包</span><span>30</span>
        </div>
        <div class='listBody'>
          <div>
            <div>Id:200</div>
            <div class='body-time'>2020-04-21 21:10:49</div>
          </div>
          <div class='body-button'>已完成</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default{
      name:'record'
  }
</script>

<style scoped lang="less">
  .record{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 11px;
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
  }
  .recordBox{
    width: 728px;
    height: 29.5vh;
    background: url(../../../static/envelopes/record.png) no-repeat;
    background-size: 100% 100%;
    margin-bottom: 1vh;
  }
  .recordList::-webkit-scrollbar{
 
   display:none;
 

  }
  .recordList{
    width: 100%;
    padding: 0 11px;
    box-sizing: border-box;
    height: 69.5vh;
    overflow: hidden;
    overflow-y: auto;
    li{
      background-color: #fff;
      padding: 10px;
      border-radius: 5px;
      margin-top: 20px;
      .listTitle{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .listBody{
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        .body-time{
          font-size: 25px;
          color: #afafaf;
        }
        .body-button{
          border-radius: 30px;
          background-color: #9a9a9a;
          color: #fff;
          font-size: 25px;
          padding: 5px 10px;
        }
      }
    }
  }
</style>
