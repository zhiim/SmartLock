<?php
class User_model extends CI_Model {
    // 当前用户
    private $user;

    // 注册或更新用户
    public function registOrUpdate($data) {
        if ($this->verify($data)) {
            $this->update(['session_key' => $data->session_key], ['uid' => $this->user->uid]);
        } else {
            $this->regist($data);
        }
        $response = [
            'thirdSession' => $this->generate3rdSession()
        ];
        echo json_encode($response);
    }

    // 注册用户
    private function regist($data) {
        $this->db->insert('user', $data);
    }

    // 更新用户
    private function update($user, $condition) {
        $this->db->update('user', $user, $condition);
    }

    // 检测用户是否存在
    private function verify($data) {
        $query = $this->db->get_where('user', ['openid'=>$data->openid]);
        $user = $query->first_row();
        $this->user = $user;
        if ($query->num_rows()) {
            return true;
        }
        return false;
    }
}
