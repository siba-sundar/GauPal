// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BreedRegistry {
    struct Breed {
        string breedId;
        string category; // cow/buffalo
        uint256 version;
        bytes32 metadataHash; // hash of full JSON
        string ipfsHash; // IPFS link for images/descriptions
        address updatedBy;
        uint256 timestamp;
    }

    mapping(string => Breed[]) private breedHistory; // breedId => versions

    event BreedAdded(string breedId, uint256 version, address updatedBy);

    function addOrUpdateBreed(
        string memory _breedId,
        string memory _category,
        bytes32 _metadataHash,
        string memory _ipfsHash
    ) external {
        uint256 version = breedHistory[_breedId].length + 1;
        Breed memory newBreed = Breed({
            breedId: _breedId,
            category: _category,
            version: version,
            metadataHash: _metadataHash,
            ipfsHash: _ipfsHash,
            updatedBy: msg.sender,
            timestamp: block.timestamp
        });
        breedHistory[_breedId].push(newBreed);
        emit BreedAdded(_breedId, version, msg.sender);
    }

    function getLatestBreed(string memory _breedId) external view returns (Breed memory) {
        require(breedHistory[_breedId].length > 0, "Breed not found");
        return breedHistory[_breedId][breedHistory[_breedId].length - 1];
    }

    function getBreedVersion(string memory _breedId, uint256 version) external view returns (Breed memory) {
        require(version > 0 && version <= breedHistory[_breedId].length, "Invalid version");
        return breedHistory[_breedId][version - 1];
    }
}

contract AnimalRegistry {
    struct Animal {
        string animalId;
        string breedId;
        string aiPrediction;
        uint8 confidenceScore;
        bytes32 imageHash;
        bytes32 metadataHash;
        address submittedBy; // FLW identity passed from server
        bool expertVerified;
        address expertVerifier;
        uint256 timestamp;
    }

    mapping(string => Animal) public animals; // animalId => Animal

    event AnimalRegistered(string animalId, string breedId, string aiPrediction, uint8 confidenceScore, address submittedBy);
    event LowConfidenceFlagged(string animalId, string breedId, uint8 confidenceScore);
    event ExpertVerified(string animalId, string verifiedBreed, address verifier);

    function registerAnimal(
        string memory _animalId,
        string memory _breedId,
        string memory _aiPrediction,
        uint8 _confidenceScore,
        bytes32 _imageHash,
        bytes32 _metadataHash,
        address _submittedBy
    ) external {
        Animal memory newAnimal = Animal({
            animalId: _animalId,
            breedId: _breedId,
            aiPrediction: _aiPrediction,
            confidenceScore: _confidenceScore,
            imageHash: _imageHash,
            metadataHash: _metadataHash,
            submittedBy: _submittedBy,
            expertVerified: false,
            expertVerifier: address(0),
            timestamp: block.timestamp
        });
        animals[_animalId] = newAnimal;

        emit AnimalRegistered(_animalId, _breedId, _aiPrediction, _confidenceScore, _submittedBy);

        if (_confidenceScore < 70) { // threshold for expert review
            emit LowConfidenceFlagged(_animalId, _breedId, _confidenceScore);
        }
    }

    function updateExpertVerification(string memory _animalId, string memory _verifiedBreed, address _verifier) external {
        Animal storage animal = animals[_animalId];
        require(!animal.expertVerified, "Already verified");
        animal.breedId = _verifiedBreed;
        animal.expertVerified = true;
        animal.expertVerifier = _verifier;

        emit ExpertVerified(_animalId, _verifiedBreed, _verifier);
    }
}
