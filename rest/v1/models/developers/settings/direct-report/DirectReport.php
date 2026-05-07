<?php

class DirectReport {
    public $direct_report_aid;
    public $direct_report_is_active;
    public $direct_report_subordinate_id;
    public $direct_report_supervisor_id;
    public $direct_report_created;
    public $direct_report_updated;

    // Pagination & Search properties
    public $start;
    public $total;
    public $search;

    public $connection;
    public $lastInsertedId;
    public $tblDirectReport;
    public $tblEmployees;
    public $tblSettingsDepartment;

    public function __construct($db) {
        $this->connection = $db;
        $this->tblDirectReport = "direct_report";
        $this->tblEmployees = "employees";
        $this->tblSettingsDepartment = "settings_department";
    }

    public function checkCircularReference() {
        try {
            $sql = "select * from {$this->tblDirectReport} ";
            $sql .= "where direct_report_supervisor_id = :proposed_subordinate ";
            $sql .= "and direct_report_subordinate_id = :proposed_supervisor ";
            
            $query = $this->connection->prepare($sql);
            $query->execute([
                "proposed_subordinate" => $this->direct_report_subordinate_id,
                "proposed_supervisor" => $this->direct_report_supervisor_id
            ]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function getSupervisorDetails() {
        try {
            $sql = "select * from {$this->tblEmployees} where employee_aid = :id";
            $query = $this->connection->prepare($sql);
            $query->execute(["id" => $this->direct_report_supervisor_id]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function updateEmployeeRecord($fname, $lname, $email) {
        try {
            $sql = "update {$this->tblEmployees} set ";
            $sql .= "employee_supervisor_id = :sup_id, ";
            $sql .= "employee_supervisor_first_name = :sup_fname, ";
            $sql .= "employee_supervisor_last_name = :sup_lname, ";
            $sql .= "employee_supervisor_email = :sup_email ";
            $sql .= "where employee_aid = :sub_id";

            $query = $this->connection->prepare($sql);
            $query->execute([
                "sup_id" => $this->direct_report_supervisor_id,
                "sup_fname" => $fname,
                "sup_lname" => $lname,
                "sup_email" => $email,
                "sub_id" => $this->direct_report_subordinate_id
            ]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function create() {
        try {
            $sql = "insert into {$this->tblDirectReport} (
                direct_report_is_active,
                direct_report_subordinate_id,
                direct_report_supervisor_id,
                direct_report_created,
                direct_report_updated
            ) values (
                :direct_report_is_active,
                :direct_report_subordinate_id,
                :direct_report_supervisor_id,
                :direct_report_created,
                :direct_report_updated
            )";

            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_is_active" => $this->direct_report_is_active,
                "direct_report_subordinate_id" => $this->direct_report_subordinate_id,
                "direct_report_supervisor_id" => $this->direct_report_supervisor_id,
                "direct_report_created" => $this->direct_report_created,
                "direct_report_updated" => $this->direct_report_updated
            ]);

            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function readAll() {
        try {
            $sql = "select d.*, ";
            $sql .= "sub.employee_first_name as sub_fname, sub.employee_last_name as sub_lname, ";
            $sql .= "sup.employee_first_name as sup_fname, sup.employee_last_name as sup_lname, ";
            $sql .= "dept.department_name ";
            $sql .= "from {$this->tblDirectReport} d ";
            $sql .= "left join {$this->tblEmployees} sub on d.direct_report_subordinate_id = sub.employee_aid ";
            $sql .= "left join {$this->tblEmployees} sup on d.direct_report_supervisor_id = sup.employee_aid ";
            $sql .= "left join {$this->tblSettingsDepartment} dept on sub.employee_department_id = dept.department_aid ";
            $sql .= "where 1=1 ";
            
            if ($this->direct_report_is_active != "") {
                $sql .= "and d.direct_report_is_active = :direct_report_is_active ";
            }
            if ($this->search != "") {
                $sql .= "and (sub.employee_first_name like :search1 or sub.employee_last_name like :search2 or sup.employee_first_name like :search3 or sup.employee_last_name like :search4) ";
            }
            $sql .= "order by d.direct_report_aid desc ";

            $query = $this->connection->prepare($sql);

            if ($this->direct_report_is_active != "") {
                $query->bindValue(":direct_report_is_active", (int)$this->direct_report_is_active, PDO::PARAM_INT);
            }
            if ($this->search != "") {
                $searchVal = "%{$this->search}%";
                $query->bindValue(":search1", $searchVal, PDO::PARAM_STR);
                $query->bindValue(":search2", $searchVal, PDO::PARAM_STR);
                $query->bindValue(":search3", $searchVal, PDO::PARAM_STR);
                $query->bindValue(":search4", $searchVal, PDO::PARAM_STR);
            }

            $query->execute();
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function readLimit() {
        try {
            $sql = "select d.*, ";
            $sql .= "sub.employee_first_name as sub_fname, sub.employee_last_name as sub_lname, ";
            $sql .= "sup.employee_first_name as sup_fname, sup.employee_last_name as sup_lname, ";
            $sql .= "dept.department_name ";
            $sql .= "from {$this->tblDirectReport} d ";
            $sql .= "left join {$this->tblEmployees} sub on d.direct_report_subordinate_id = sub.employee_aid ";
            $sql .= "left join {$this->tblEmployees} sup on d.direct_report_supervisor_id = sup.employee_aid ";
            $sql .= "left join {$this->tblSettingsDepartment} dept on sub.employee_department_id = dept.department_aid ";
            $sql .= "where 1=1 ";
            
            if ($this->direct_report_is_active != "") {
                $sql .= "and d.direct_report_is_active = :direct_report_is_active ";
            }
            if ($this->search != "") {
                $sql .= "and (sub.employee_first_name like :search1 or sub.employee_last_name like :search2 or sup.employee_first_name like :search3 or sup.employee_last_name like :search4) ";
            }
            $sql .= "order by d.direct_report_aid desc ";
            $sql .= "limit :start, :total ";

            $query = $this->connection->prepare($sql);

            if ($this->direct_report_is_active != "") {
                $query->bindValue(":direct_report_is_active", (int)$this->direct_report_is_active, PDO::PARAM_INT);
            }
            if ($this->search != "") {
                $searchVal = "%{$this->search}%";
                $query->bindValue(":search1", $searchVal, PDO::PARAM_STR);
                $query->bindValue(":search2", $searchVal, PDO::PARAM_STR);
                $query->bindValue(":search3", $searchVal, PDO::PARAM_STR);
                $query->bindValue(":search4", $searchVal, PDO::PARAM_STR);
            }
            
            // FIXED: Using your exact system math for pagination offset
            $query->bindValue(":start", (int)($this->start - 1), PDO::PARAM_INT);
            $query->bindValue(":total", (int)$this->total, PDO::PARAM_INT);

            $query->execute();
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function readById() {
        try {
            $sql = "select * from {$this->tblDirectReport} where direct_report_aid = :direct_report_aid";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_aid" => $this->direct_report_aid
            ]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function update() {
        try {
            $sql = "update {$this->tblDirectReport} set ";
            $sql .= "direct_report_subordinate_id = :direct_report_subordinate_id, ";
            $sql .= "direct_report_supervisor_id = :direct_report_supervisor_id, ";
            $sql .= "direct_report_updated = :direct_report_updated ";
            $sql .= "where direct_report_aid = :direct_report_aid";

            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_subordinate_id" => $this->direct_report_subordinate_id,
                "direct_report_supervisor_id" => $this->direct_report_supervisor_id,
                "direct_report_updated" => $this->direct_report_updated,
                "direct_report_aid" => $this->direct_report_aid
            ]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function delete() {
        try {
            $sql = "delete from {$this->tblDirectReport} where direct_report_aid = :direct_report_aid";
            $query = $this->connection->prepare($sql);
            $query->execute(["direct_report_aid" => $this->direct_report_aid]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }

    public function clearEmployeeSupervisor() {
        try {
            $sql = "update {$this->tblEmployees} set ";
            $sql .= "employee_supervisor_id = NULL, ";
            $sql .= "employee_supervisor_first_name = NULL, ";
            $sql .= "employee_supervisor_last_name = NULL, ";
            $sql .= "employee_supervisor_email = NULL ";
            $sql .= "where employee_aid = :sub_id";

            $query = $this->connection->prepare($sql);
            $query->execute(["sub_id" => $this->direct_report_subordinate_id]);
        } catch (PDOException $e) {
            returnError($e);
            $query = false;
        }
        return $query;
    }
}