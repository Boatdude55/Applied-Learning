<?php
$lib_URL = $_GET['q'];
class Github_Parser{
    /**
     * All files have a 'blob' in their url string/path
     * All directories have a div with a class='file-wrap'
     * Best to turn parsed results to JSON(easy format for D3.js to handle)
     * **/
    
    //Variables
    /*
    private $query_nodes = array('table' => 'table',
                        'tbody' => 'tbody',
                        'tr' => 'tr',
                        'td' => 'td',
                        'span' => 'span',
                        'a' => 'a');
                        
    private $query_classes = array('directory' => "[@class='file-wrap']",
                    'dir_contents' => "[@class='content']",
                    'external_lib' => "[@class='pl-k']",
                    'external_lib_name' => "[@class='pl-s']");

    private $query_scope = array('document' => '//',
                        'node' => '/',
                        'context_node' => './',
                        'wildcard' => '*');
    */
    protected $DOMobj = NULL;
    protected $file_children_super = array();
    protected $scheme_host = 'https://github.com';
    protected $url_filter_flags = array(FILTER_FLAG_SCHEME_REQUIRED, FILTER_FLAG_HOST_REQUIRED);
    private static $counter = 0;
    
    //Methods: Set up data to be encoded to JSON using JSON_encode
    private function validate_url($url){
        $valid_url = filter_var($url,FILTER_VALIDATE_URL,$this->url_filter_flags);
        
        if($valid_url == !FALSE){
            return $valid_url;
        }else{
            return $this->scheme_host . $url;
        }
    }
    
    function __construct(){
        libxml_use_internal_errors(true);
        $this->DOMobj = new DOMDocument();
    }
 
    public function Github_repo_iterator($url='https://github.com/pencil2d/pencil/tree/master/core_lib/graphics/vector', $file_name = NULL, $file_type = FALSE){
        $valid_url_check = $this->validate_url($url);
        if($valid_url_check == !FALSE){
            if($file_type){
                //base case
                $file_URL = $url;
                $file_URL_html = file_get_contents($file_URL);
                $this->DOMobj->loadHTML($file_URL_html);
                $this->DOMobj->validateOnParse = true;
                
                if(is_a($this->DOMobj, 'DOMDocument')){
                    $FILE_DOMXpath = new DOMXPath($this->DOMobj);
                    //echo "Successful construction:";
                }else{
                    //echo "Error no html passed\n";
                }
                
                $file_externals_obj = $this->get_file_externals($FILE_DOMXpath);//returns a nodelist
                $file_externals_array = $this->sort_file_externals($file_externals_obj);//returns a array
                if($file_externals_array === NULL){
                    echo 'No externals provided';
                    return NULL;
                }else{
                   return $file_externals_array;
                }
            }else{
                //recursive case
                $dir_URL = $url;
                $dir_URL_html = file_get_contents($dir_URL);
                $this->DOMobj->loadHTML($dir_URL_html);
                $this->DOMobj->validateOnParse = true;
                
                if(is_a($this->DOMobj, 'DOMDocument')){
                    $DIR_DOMXpath = new DOMXPath($this->DOMobj);
                    //echo "Successful construction:";
                }else{
                    //echo "Error no html passed\n";
                }
                
                $dir_list_obj = $this->get_dir_list($DIR_DOMXpath);//returns a node list
                $children = $this->sort_dir_list($dir_list_obj);//arguments url, nodelist obj. returns an array 

                foreach($children as &$child){
                     $url = $child['url'];
                     $name = $child['name'];
                     $type= $child['FILE'];
                     $child['children'] = $this->Github_repo_iterator($url, $name, $type);
                }
                //var_dump($children);
                return $children;
            }
        }else{
                return "Not a valid url request; Did you mean?: ". $valid_url_check;
        }
    }
    
    private function get_dir_list(&$DIR_Xpath = NULL){
        /**
         * $file_tree_query = "//@class='file-wrap'";
         * $file_query = "./table/tbody/tr/td[@class='content']/span/a";
         * **/
        if($DIR_Xpath){
            $DIR_Xpath_query = "//*[@class='file-wrap']/table/tbody/tr/td[@class='content']/span/a";
    
            /*$this->query_scope['document'].
            $this->query_classes['dir_contents'].$this->query_scope['node'].$this->query_nodes['span'].$this->query_scope['node'].$this->query_nodes['a'];*/ //Template for more automized query creation
    
            $dir_DOMlist = $DIR_Xpath->query($DIR_Xpath_query);
            
            if($dir_DOMlist != FALSE || $dir_DOMlist->length > 0){
                //echo "\nSuccess DOMnodelist returned";
                return $dir_DOMlist;
            }else{
                //echo "\nError no Nodelist provided:", 'query:',$this->Xpath_query;
            }
        }else{
            return;
        }
    }
    
    private function sort_dir_list($files_list){
        $child_dir = array();
        if(is_a($files_list,"DOMNodeList")){
            //echo "\nSuccess a Nodelist will be sorted";
            foreach($files_list as $file){
                $file_name = $file->textContent;
                $file_path = $file->attributes->getNamedItem('href')->textContent;
                $file_path = $this->validate_url($file_path);
                $type = $this->sort_file_type($file_path);
                    $child_dir[] = array('name'=> $file_name,
                                                'url' => $file_path,
                                                'FILE' => $type,
                                                'children' => NULL);
            }
            return $child_dir;
        }else{
            //echo "No Nodelist available";
            return NULL;
        }
        
    }    
    
    private function sort_file_type($file){
        $type = substr_count($file, 'blob');
        if($type > 0){
            return TRUE;
        }else{
            return FALSE;
        }
    } 
    
    private function get_file_externals(&$FILE_Xpath = NULL){
        if($FILE_Xpath){//div[@class='file']/table/tbody/tr/td [@class='blob-code blob-code-inner js-file-line']
            $Xpath_query = "//table[@class='highlight tab-size js-file-line-container']/tr/td[contains(.,'#include')]";
        
            $externals = $FILE_Xpath->query($Xpath_query);
            
            if($externals != FALSE || $externals->length > 0){
                //echo "\nSuccess DOMnodelist returned";
                return $externals;
            }else{
                //echo "\nError no Nodelist provided:", 'query:',$this->Xpath_query;
            }
        }else{
            return;
        }
    }
    
    private function sort_file_externals($external_list){
        if(is_a($external_list,"DOMNodeList")){
            $external_array = array();
            //echo "\nSuccess a Nodelist will be sorted";
            foreach($external_list as $external){
                $set_external = explode(' ',$external->textContent);
                $temp_external = $set_external[1];
                if($temp_external != NULL){
                    $temp_external = trim($temp_external, '"');
                    $external_array[] = array('name' => $temp_external,
                                                'weight' => NULL);
                }
                
            }
            return $external_array;
        }else{
            //echo "No Nodelist available";
            return NULL;
        }
        
    }
}

/*class File_Handler{
    //Methods
    private function get_file_Methods($file_name){
         
    }
}
*/
$get_github = new Github_Parser;
//$input_url = 'https://github.com/pencil2d/pencil/tree/master/core_lib/graphics/vector';
$parent_name = substr(strrchr($lib_URL, '/'), 1);
$file_tree_array = $get_github->Github_repo_iterator($lib_URL);
$tree_root = array('name' => $parent_name,'url' => $input_url,'children' => $file_tree_array);

/*Works for c/c++ directories, turn ditectory array to JSON JSON_HEX_TAG*/

echo '<html><body><div>'.json_encode($tree_root, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK).'</div></body></html>';
?>