<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="90px">
      <el-row :gutter="20">
        <el-col >
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="上级目录">
            <treeselect
              v-model="form.categoryId"
              :options="treeselectNav"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-form-item label="文章摘要">
            <el-input v-model="form.summary" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="允许评论">
            <el-radio-group v-model="form.isComment">
              <el-radio :key="'0'" :label="'0'">正常</el-radio>
              <el-radio :key="'1'" :label="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :key="'0'" :label="'0'">正式文章</el-radio>
              <el-radio :key="'1'" :label="'1'">草稿</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="VIP限制">
            <el-select v-model="form.vipLevelLimit" placeholder="请选择">
              <el-option
                v-for="vip in vipList"
                :key="vip.id"
                :label="vip.vipName"
                :value="vip.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="积分限制">
            <el-input-number
              :min="0"
              :max="1000000"
              size="small"
              v-model="form.fundLimit"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col >
          <el-form-item label="视频URL" prop="guideVideoUrl">
            <el-input
              v-model="form.guideVideoUrl"
              placeholder="请输入视频的URL，输入正确的URL将会置顶在教程的最上方公开部分"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item>
            <el-button @click="saveOrUpdate" type="primary" size="medium">{{ aId>0?"更新":"发布" }}</el-button>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="公开内容">
        <mavon-editor ref="md" v-model="form.content" @imgAdd="addImg" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="隐藏资源">
          <mavon-editor ref="md" v-model="form.hiddenData" @imgAdd="addImg" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="隐藏教程">
          <mavon-editor ref="md" v-model="form.hiddenGuide" @imgAdd="addImg" />
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  deleteNav,
  editNav,
  getGuideArticle,
  getNavList,
  getTreeselectNav,
  saveOrUpdateGuideArticle
} from '@/api/content/guide'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getAllVip } from '@/api/system/vip'
import { uploadImg } from '@/api/content/upload'

export default {
  name: 'GuideWrite',
  components: { Treeselect },
  data() {
    return {
      treeselectNav:[],
      normalizer(node){
        return {
          id: node.id,
          label: node.name,
          children: node.childrens
        }
      },
      vipList:[{
        "id":"0",
        "vipLevel":0,
        "vipName":"普通用户"
      },],
      form: {
        title: '',
        categoryId:"-1",
        isComment: '0',
        content: '',
        status:'0',
        vipLevelLimit:'0',
        fundLimit:'0',
        guideVideoUrl:"",
        hiddenGuide:"",
        hiddenData:"",
      },
      aId: -1,
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange',
  },
  methods:{
    // 绑定@imgAdd event
    addImg(pos, file) {
      // 第一步.将图片上传到服务器.
      uploadImg(file).then(response => {
        this.$refs.md.$img2Url(pos, response)
      }).catch(error => {
        this.$message.error(error.msg)
      })
    },
    getVipList(){
      getAllVip().then(res=>{
        this.vipList = this.vipList.concat(res)
      })
    },
    routeChange() {
      this.aId = this.$route.query.aId == undefined ? -1 : parseInt(this.$route.query.aId);
      if(this.aId>0)
        this.getOneArticle(this.aId);
      else{
        this.form = {
          title: '',
            categoryId:"-1",
            isComment: '0',
            content: '',
            status:'0',
            vipLevelLimit:'0',
            fundLimit:'0',
            guideVideoUrl:"",
            hiddenGuide:"",
            hiddenData:"",
        }
      }
    },
    getNavTree(){
      var that = this;
      getTreeselectNav().then((res)=>{
        that.treeselectNav = res;
      });
    },
    getOneArticle(id){
      getGuideArticle(id).then(res=>{
        this.form = res;
      })
    },
    saveOrUpdate(){
      saveOrUpdateGuideArticle(this.form).then(res=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        });
      });
    },
  },
  mounted() {
    this.routeChange();
    this.getVipList();
    this.getNavTree();
  },
  created() {
  },
}
</script>

<style scoped>

</style>
