<template>
  <div class="app-container" v-loading="loading">
    <el-button
      type="primary"
      plain
      icon="el-icon-plus"
      @click="handleAdd"
    >新增</el-button>
    <el-table :data="articleList" style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" width="80"/>
      <el-table-column prop="createByNickname" label="用户名" align="center" width="80"/>
      <el-table-column prop="title" label="标题" align="center" />
      <el-table-column label="文章父节点类别" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini">{{ scope.row.category.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="摘要" align="center" />
      <el-table-column prop="status" label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.status == 0" type="success">正式</el-tag>
          <el-tag size="mini" v-if="scope.row.status == 1" type="warning">草稿</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="vipLevelLimit" label="VIP限制级别" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.vipLevelLimit == 0" type="info">无</el-tag>
          <el-tag size="mini" v-if="scope.row.vipLevelLimit == 1" type="success">VIP</el-tag>
          <el-tag size="mini" v-if="scope.row.vipLevelLimit == 2" type="warning">SVIP</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fundLimit" label="积分限制" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini">{{ scope.row.fundLimit }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size.sync="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[ 10, 20, 40]"
      :current-page.sync="queryParams.pageNum"
      @current-change="getGuideArticle"
      @size-change="getGuideArticle"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { deleteGuideArticle, listGuideArticle } from '@/api/content/guide'
import { delArticle } from '@/api/content/article'

export default {
  name: 'GuideIndex',
  components: { Treeselect },
  data(){
    return {
      loading:true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      articleList:[],
      total:0,
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange',
  },
  methods:{
    routeChange() {
      this.getGuideArticle();
    },
    getGuideArticle(){
      this.loading = true;
      listGuideArticle(this.queryParams).then(res=>{
        this.articleList = res.rows;
        this.total = res.total;
        this.loading = false;
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push('/GuideArticle?aId=' + row.id)
    },
    /** 新增 */
    handleAdd() {
      this.$router.push('/GuideArticle')
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除分类编号为"' + ids + '"的数据项？').then(()=>{
        deleteGuideArticle(ids).then(_=>{
          this.$notify({
            type:"success",
            message:"删除成功"
          });
          this.getGuideArticle();
        })
      }).catch(() => {})
    }
  },
  mounted() {
    this.routeChange();
  },
  created() {
  },
}
</script>

<style scoped>

</style>
