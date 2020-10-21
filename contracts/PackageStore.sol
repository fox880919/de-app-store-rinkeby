/* eslint-disable */
// tslint:disable-next-line:max-line-length

 pragma solidity ^0.5.6;

import { SafeMath } from "../libraries/SafeMath.sol";


contract PackageStore {

using SafeMath for uint256;

    event newPackageEvent(string fileName, string fileVersion);

    event newPackageVersionEvent(string fileName, string fileVersion);

    event EditPackage (string oldName, string fileName, string imgHash);

    event editPackageVersionEvent (string fileName, string fileVersion);

    event deletePackage(string fileName);

    event deletePackageVersion (string fileName, string fileVersion);

    address private mainOwner;

    address[] adminsIndexes;

    mapping (address => bool) private admins;
    

    string[] mappingKeys;

    mapping (string => Package) private packages;

    mapping (address => bool) private lockedOut;


    constructor () public{

        mainOwner = msg.sender;
    }

  struct Package {

        bool exists;

        string imgHash;

        address owner;

        string[] versions;

        string versionsString;

        mapping (string => File) versionsFiles;
    }

    struct File {

        string fileHash;
        string fileVersion;
        uint date;
        bool exists;
    }



    modifier isNewPackageName (string memory _fileName) {

        require(!(packages[_fileName].exists == true), "Package already exists");
    _;
    }

    modifier isMainOwner() {

        require(mainOwner == msg.sender, "Only the main owner of the store can manage the store");
    _;
    }

    modifier isNewAdmin(address _admin) {

       require(admins[_admin] == false, "Only the main owner of the store can manage the store");
    _;
    }

    modifier isAnOwnerOrAnAdmin (string memory _fileName) {

        require(packages[_fileName].owner == msg.sender
        || isAnOwnerOrAdminOrUser(msg.sender) == 1 || isAnOwnerOrAdminOrUser(msg.sender) == 0,
         "Only the owner or of the package or an admin in the store can manage the package");
    _;
    }

    modifier isNotContractAndNotLockedOut(address _a){

        uint len = 0;

        //Not a real error
        assembly { len := extcodesize(_a) }
        require(len == 0 && lockedOut[_a] == false);
        _;
    }


    modifier packageExists (string memory _fileName) {

        require(packages[_fileName].exists == true, "Package doesn't exist");

    _;
    }

    modifier isNewVersion (string memory _fileName,  string memory _fileVersion) {

        require(packages[_fileName].versionsFiles[_fileVersion].exists != true, "Version does exist");

    _;
    }

    modifier DoesVersionExists (string memory _fileName, string memory _fileVersion) {

        require(packages[_fileName].versionsFiles[_fileVersion].exists == true, "Version doesn't exist");
    _;
    }

    function isAnOwnerOrAdminOrUser() public view returns (uint){

        return isAnOwnerOrAdminOrUser(msg.sender);
    }

    function isAnOwnerOrAdminOrUser(address _user)  public view returns (uint)  {

            if(mainOwner == _user)
            {
                return 0;
            }
            else if(admins[_user] == true)
            {
                return 1;
            }
            else{

                return 2;
            }
    }

    function changeMainOwner(address _mainOwner)
    public isMainOwner(){

        mainOwner = _mainOwner;
    }

    function addAnAdmin(address _admin)
    public isMainOwner() isNewAdmin(_admin){

        adminsIndexes.push(_admin);

        admins[_admin] = true;
    }

    function removeAnAdmin(uint index)
    public isMainOwner(){

        uint i = index;

        delete admins[adminsIndexes[index]];

        while (i < adminsIndexes.length-1) {
            adminsIndexes[i] = adminsIndexes[i+1];
            i++;
            }
            adminsIndexes.length--;
    }


    function addNewPackage(string memory _fileHash, string memory _imgHash,
     string memory _fileName, string memory _fileVersion, uint _date) public
     isNewPackageName (_fileName) isNotContractAndNotLockedOut(msg.sender){

         lockedOut[msg.sender] == true;

    //require(!(packages[_fileName].exists == true), "Package already exists");

        packages[_fileName].owner = msg.sender;

        packages[_fileName].imgHash = _imgHash;

         packages[_fileName].versionsFiles[_fileVersion] = File
         ({fileHash: _fileHash, fileVersion: _fileVersion, date: _date, exists: true});

        packages[_fileName].exists = true;

        packages[_fileName].versions.push(_fileVersion);

        packages[_fileName].versionsString = strConcat(uint2str(1),
        ": ", _fileVersion, "", "");

        mappingKeys.push(_fileName);

        lockedOut[msg.sender] == false;


        // emit newPackageEvent(_fileName, packages[_fileName].versionsFiles[_fileVersion].fileHash);

        emit newPackageEvent(_fileName, packages[_fileName].versionsFiles[_fileVersion].fileVersion);


       // emit newPackageEvent(1, 2);

    }

        function addNewVersion(string memory _fileHash, string memory _fileName, string memory _fileVersion, uint _date) public
         packageExists(_fileName) isNewVersion(_fileName, _fileVersion) isAnOwnerOrAnAdmin(_fileName) isNotContractAndNotLockedOut(msg.sender){
        
            lockedOut[msg.sender] == true;

            packages[_fileName].versions.push(_fileVersion);

            packages[_fileName].versionsString = strConcat
            (packages[_fileName].versionsString, ",", uint2str(packages[_fileName].versions.length), ": ", _fileVersion);

            packages[_fileName].versionsFiles[_fileVersion] = File
            ({fileHash: _fileHash, fileVersion: _fileVersion, date: _date, exists: true});

            lockedOut[msg.sender] == false;

            emit newPackageVersionEvent(_fileName, _fileVersion);
    }


      function changePackageNameAndImage(string memory _fileName, uint index, string memory _newName,
        string memory _imgHash, bool saveNewName, bool saveNewImg) public
     packageExists(_fileName) isNewPackageName (_newName) isAnOwnerOrAnAdmin(_fileName) isNotContractAndNotLockedOut(msg.sender){

         lockedOut[msg.sender] == true;
        if(saveNewImg)
        {
            packages[_fileName].imgHash = _imgHash;
        }

         if(saveNewName)
         {

            packages[_newName] = packages[_fileName];

            mappingKeys[index] = _newName;

            delete packages[_fileName];
         }

        lockedOut[msg.sender] == false;
        emit EditPackage (_fileName, _newName, _imgHash);
    }


    function deleteAPackage(string memory _fileName, uint index) public
     packageExists(_fileName) isAnOwnerOrAnAdmin(_fileName) isNotContractAndNotLockedOut(msg.sender){

         lockedOut[msg.sender] == true;
        delete packages[mappingKeys[index]];

        // delete mappingKeys[index];

        // mappingKeys.length = mappingKeys.length - 1;

        removeByIndex(_fileName, index, true);

        lockedOut[msg.sender] == false;

        emit deletePackage(_fileName);
    }


     function deleteAPackageVersion(string memory _fileName, string memory _fileVersion, uint index) public
      packageExists(_fileName) DoesVersionExists(_fileName, _fileVersion) isAnOwnerOrAnAdmin(_fileName) isNotContractAndNotLockedOut(msg.sender){

          lockedOut[msg.sender] == true;
        // delete packages[_fileName].versions[index];

        // packages[_fileName].versions.length = packages[_fileName].versions.length - 1;

        removeByIndex(_fileName, index, false);

        delete packages[_fileName].versionsFiles[_fileVersion];

        constructVersionsString(_fileName);

        lockedOut[msg.sender] == false;
        emit deletePackageVersion(_fileName, _fileVersion);
    }

    function removeByIndex(string memory _fileName,  uint index, bool fromPackage) private {

        uint i = index;

        if(fromPackage)
        {

            while (i < mappingKeys.length-1) {
            mappingKeys[i] = mappingKeys[i+1];
            i++;
            }
            mappingKeys.length--;
        }
            else{

                while (i < packages[_fileName].versions.length-1) {
                packages[_fileName].versions[i] = packages[_fileName].versions[i+1];
                i++;
                }
                packages[_fileName].versions.length--;
        }

  }


    function getAdminsCount() public view returns (uint256){

        return adminsIndexes.length;
    }


    function getPackagescount() public view returns (uint256){

        return mappingKeys.length;
    }


    function constructVersionsString(string memory _fileName) private {

        packages[_fileName].versionsString = "";

        for(uint i = 0; i < packages[_fileName].versions.length; i++)
            {

            string memory fileVersion = packages[_fileName].versions[i];

            if(i == 0)
            {

                packages[_fileName].versionsString = strConcat(uint2str(1),
                ": ", fileVersion, "", "");
            }

            else{

            packages[_fileName].versionsString = strConcat
            (packages[_fileName].versionsString, ",", uint2str(i+1), ": ", fileVersion);

            }
        }
    }

    function getAdmin(uint _index) public view returns (address){

        return adminsIndexes[_index];
    }

    function getPackageInfo(uint256 index) public view returns
    (string memory, string memory, string memory, string memory, bool canEdit, address owner){
        
        bool userCanEdit = false;

        uint userRoleNumber = isAnOwnerOrAdminOrUser(msg.sender);

        if(userRoleNumber == 0 || userRoleNumber == 1 || packages[mappingKeys[index]].owner == msg.sender){

            userCanEdit = true;
        }

        return (mappingKeys[index], packages[mappingKeys[index]].imgHash,
         packages[mappingKeys[index]].versionsString, getPackageLastVersion(mappingKeys[index]), userCanEdit, packages[mappingKeys[index]].owner);
    }

    // function getPackage(string memory _fileName, string memory _fileVersion) public
    // packageExists(_fileName)
    //  view returns(string memory, string memory, uint){

    //     File memory file = packages[_fileName].versionsFiles[_fileVersion];

    //     return (file.fileHash, file.fileVersion, file.date);
    // }

    function getPackageVersions(string memory _fileName) private
    packageExists(_fileName)
    view returns (string memory) {

        string memory tempVersions = packages[_fileName].versionsString;

        return tempVersions;
    }

      function getPackageLastVersion(string memory _fileName) private
      packageExists(_fileName)
      view returns (string memory)
      {

        string[] memory tempVersions = packages[_fileName].versions;


        return tempVersions[tempVersions.length - 1];
    }

     function getPackageVersionHash(string memory _fileName, string memory _fileVersion) public
     packageExists(_fileName) DoesVersionExists(_fileName, _fileVersion)
     view returns (string memory) {

        return packages[_fileName].versionsFiles[_fileVersion].fileHash;
    }

function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e)
     private pure returns (string memory _concatenatedString) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        uint i = 0;
        for (i = 0; i < _ba.length; i++) {
            babcde[k++] = _ba[i];
        }
        for (i = 0; i < _bb.length; i++) {
            babcde[k++] = _bb[i];
        }
        for (i = 0; i < _bc.length; i++) {
            babcde[k++] = _bc[i];
        }
        for (i = 0; i < _bd.length; i++) {
            babcde[k++] = _bd[i];
        }
        for (i = 0; i < _be.length; i++) {
            babcde[k++] = _be[i];
        }
        return string(babcde);
    }

    function uint2str(uint _n) private pure returns (string memory _uintAsString) {
        if (_n == 0) {
            return "0";
        }
        uint _i = _n;
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}