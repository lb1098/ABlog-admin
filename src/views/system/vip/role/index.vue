<template>
  <div>
    <div class="app-container">
      <el-table
        :data="AllVipList"
        style="width: 100%"
        align="center"

      >
        <el-table-column
          label="Id"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.vip.id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="VIP名称"
          align="center"
        >
          <template slot-scope="scope">
            <span class="ab-text-overflow">{{scope.row.vip.vipName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="VIP级别"
          align="center"
        >
          <template slot-scope="scope">
            <span class="ab-text-overflow">{{scope.row.vip.vipLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="已关联的角色"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-for="role in scope.row.roles" type="info" plain size="mini" disabled>{{ role.remark }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleRole(scope.row)">关联角色</el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="会员ID">{{form.vip.id}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会员ID">{{form.vip.vipName}}</el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="会员关联角色">
            <el-select v-model="form.roleIds" multiple placeholder="请选择">
              <el-option
                v-for="role in roleOptions"
                :key="role.id"
                :label="role.remark"
                :value="role.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getVipRole, getVipRolelist, vipRefRole } from '@/api/system/vip'
import { listAllRole } from '@/api/system/role'

export default {
  name: 'VipRole',
  data(){
    return {
      AllVipList:[],
      // 弹出层标题
      title: '会员关联角色信息（权限）修改',
      // 是否显示弹出层
      open: false,
      // 角色列表
      roleOptions:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form:{
        vip:{},
        roleIds:[],
      },
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange',
  },
  methods:{
    routeChange() {
      this.getAllVipList();
      this.getAllRoles();
    },
    getAllRoles(){
      listAllRole().then((res)=>{
        this.roleOptions = res;
      });
    },
    getAllVipList(){
      getVipRolelist().then((res)=>{
        this.AllVipList = res;
      })
    },
    handleRole(row){
      console.log(row)
      this.form.vip = row.vip;
      this.form.roleIds = []
      getVipRole(row.vip.id).then( res=>{
        this.form.roleIds = res
        this.open = true
      }).catch(_=>{
        this.$notify.error({
          title: '错误',
          message: '网络异常'
        });
      })


    },
    submitForm(){
      // 提交
      vipRefRole(this.form).then((res)=>{
        // 提交成功
        this.open = false;
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        });
        this.getAllVipList();
      }).catch((_)=>{
        this.$notify.error({
          title: '错误',
          message: '提交失败'
        });
      })

    },
    cancel(){
      this.open = false
      // 表单重置
      this.form.roleIds = [];
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
