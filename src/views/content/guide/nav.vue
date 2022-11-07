<template>
  <div class="app-container">
    <el-button type="primary" @click="newCategory">新增</el-button>
    <el-table
      :data="navTree"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'childrens',}">

      <el-table-column
        prop="name"
        label="名称"
        sortable

        >
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="顺序"
        sortable

      >
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-tag type="success"  v-if="scope.row.status==0">正常</el-tag>
          <el-tag type="danger"  v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editCategory(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="deleteCategory(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="Id">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <treeselect
            v-model="form.pid"
            :options="treeselectNav"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :key="'0'" :label="'0'">正常</el-radio>
            <el-radio :key="'1'" :label="'1'">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序顺序">
          <el-input-number v-model="form.orderNum"></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditCategory">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { deleteNav, editNav, getNavList, getTreeselectNav } from '@/api/content/guide'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'GuideNav',
  components: { Treeselect },
  data(){
    return {
      dialogVisible:false,
      navTree:[],
      treeselectNav:[],
      form:{
        id:"",
        pid:"",
        name:"",
        status:"0",
        orderNum:0,
      },
      normalizer(node){
        return {
          id: node.id,
          label: node.name,
          children: node.childrens
        }
      },
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange',
  },
  methods:{
    routeChange() {
      this.getNavTree();
    },
    getNavTree(){
      var that = this;
      getNavList().then(res=>{
        that.navTree = res;
      });
      getTreeselectNav().then((res)=>{
        that.treeselectNav = res;
      });
    },
    newCategory(){
      this.form = {}
      this.dialogVisible = true;
    },
    editCategory(row){
      // console.log(row);
      this.form = row;
      this.dialogVisible = true;
    },
    submitEditCategory(){
      var that = this;
      editNav(this.form).then(res=>{
        this.$notify({
          type:'success',
          message: '已修改',

        })
        that.dialogVisible = false;
        this.getNavTree();
      })
    },
    deleteCategory(id){
      this.$confirm('此操作将删除该分类及其子分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        deleteNav(id).then(_=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getNavTree();
        })
      })
    },

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
